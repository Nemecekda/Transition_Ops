from pathlib import Path
import urllib.request, urllib.error, json, time, hashlib

OUT = Path('/tmp/tops-release-final-review')
ORIGIN = 'https://6a9f2e3981fbb90008098f68--veteranbridge-tools.netlify.app'
# Closed rejection-only inputs; inspected handlers reject all before client construction.
# No valid facts/draft/chat request, credentials, member data, or settings changes.
CASES = [
    ('navigator', 'get', 'GET', None, 405, 'POST only'),
    ('navigator', 'preflight', 'OPTIONS', None, 204, None),
    ('navigator', 'malformed_json', 'POST', '{', 400, 'Bad request'),
    ('navigator', 'no_message', 'POST', '{}', 400, 'No user message'),
    ('navigator', 'assistant_only', 'POST', '{"messages":[{"role":"assistant","content":"SYNTHETIC TEST"}]}', 400, 'No user message'),
    ('navigator', 'oversized', 'POST', 'x' * 32769, 413, 'Request too large'),
    ('resume', 'get', 'GET', None, 405, 'POST only'),
    ('resume', 'preflight', 'OPTIONS', None, 204, None),
    ('resume', 'malformed_json', 'POST', '{', 400, 'Bad JSON'),
    ('resume', 'no_experience', 'POST', '{}', 400, 'Tell us what you actually did — at least a sentence or two.'),
    ('resume', 'personal_header_rejected', 'POST', '{"name":"SYNTHETIC TEST"}', 400, 'Personal details must stay in your browser.'),
    ('resume', 'oversized', 'POST', 'x' * 65537, 413, 'Request is too large.'),
]

results = []
for endpoint, name, method, payload, expected_status, expected_error in CASES:
    request = urllib.request.Request(
        ORIGIN + '/.netlify/functions/' + endpoint,
        data=None if payload is None else payload.encode(), method=method,
        headers={'Content-Type': 'application/json', 'Origin': ORIGIN},
    )
    start = time.monotonic()
    try:
        try:
            response = urllib.request.urlopen(request, timeout=25)
        except urllib.error.HTTPError as error:
            response = error
        with response:
            raw = response.read()
            status = response.status
            headers = response.headers
        body = json.loads(raw) if raw else None
        ok = status == expected_status and (expected_error is None or body == {'error': expected_error})
        if endpoint == 'resume':
            ok = ok and headers.get('X-Transition-Ops-Resume-Handler') == '1'
        ok = ok and headers.get('Access-Control-Allow-Origin') == 'https://transitionops.org'
        item = {'endpoint': endpoint, 'case': name, 'status': status,
                'expected_status': expected_status, 'body': body,
                'elapsed_ms': round((time.monotonic() - start) * 1000),
                'content_type': headers.get('Content-Type'),
                'resume_handler_marker': headers.get('X-Transition-Ops-Resume-Handler'),
                'cors_origin': headers.get('Access-Control-Allow-Origin'),
                'response_sha256': hashlib.sha256(raw).hexdigest(), 'pass': bool(ok)}
    except Exception as error:
        item = {'endpoint': endpoint, 'case': name, 'pass': False, 'error_type': type(error).__name__}
    results.append(item)
    (OUT / 'hosted-rejections.json').write_text(json.dumps({
        'origin': ORIGIN, 'candidate': 'f63ace2e41afcb01893ce5c2e7706c4881051b11',
        'scope': 'Hosted rejection responses only. Provider bypass established by matching inspected pre-client branches; provider-account counters not read.',
        'results': results,
    }, indent=2) + '\n')
    print(('PASS' if item['pass'] else 'FAIL'), endpoint, name, item.get('status', item.get('error_type')), flush=True)

passed = sum(item['pass'] for item in results)
print(f'Hosted rejection checks: {passed}/{len(results)} PASS', flush=True)
raise SystemExit(0 if passed == len(results) else 1)
