let uuids = [];
export const genUUID = () => {
	const uuid = Math.random().toString(36).substr(2, 9);
	if(uuids.includes(uuid)){
		return genUUID();
	}
	uuids.push(uuid);
	return uuid;
}