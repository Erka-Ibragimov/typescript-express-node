export class UserEntity {
	_email: string;
	_password: string;
	_name?: string;
	constructor(email: string, password: string, name?: string) {
		this._email = email;
		this._name = name;
		this._password = password;
	}
	get email() {
		return this._email;
	}
	get pass() {
		return this._password;
	}
	get name() {
		return this._name;
	}
}
