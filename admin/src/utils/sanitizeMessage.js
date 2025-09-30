export default function sanitizeMessage(msg) {
	if (!msg) return msg;
	const lower = String(msg).toLowerCase();
	const userNotPatterns = [
		'user not',
		"doesn't exist",
		"doesn't exists",
		'not found',
		'user not found',
	];
	if (userNotPatterns.some((p) => lower.includes(p))) return 'Requested resource not found';
	return msg;
}

