export interface IAirtablePerson extends Record<string, unknown> {
	ID?: string;
	Email?: string;
	'Full Name'?: string;
	Address?: [string];
	'Address History'?: string[];
	'Slack ID'?: string;
	'Phone number'?: string;
	'Mail Sender'?: [string];
}

export interface IAirtableAddress extends Record<string, unknown> {
	ID: string;
	'Street (First Line)': string;
	'Street (Second Line)': string;
	'Delivery Notes': string;
	City: string;
	'State/Province': string;
	'Postal Code': string;
	Country: string;
	'Associated ID': string[];
	'Associated Club ID': string;
	'Sender Message Tag': string;
	'Formatted Address': string;
	'Update Form URL': string;
	'Sender Update Form URL': string;
	Status: string;
	'Missing Fields': number;
	'Too Long': number;
	'Is Valid?': number;
	'Country Code': string;
	Name: string[];
	Person: string[];
	'Receiver Mail Missions': string[];
}
