//n8n-nodes-learningsuite/nodes/LearningSuite/descriptions/customFields.properties.ts
import type { INodeProperties } from 'n8n-workflow';

export const customFieldsProperties: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['customFields'] } },
		default: 'getCards',
		options: [
			{
				name: 'Get Cards',
				value: 'getCards',
				description: 'Retrieve all custom field cards',
				action: 'Retrieve all custom field cards',
			},
			{
				name: 'Get Cards (Expanded)',
				value: 'getCardsExpanded',
				description: 'Retrieve custom field cards including their definitions and categories',
				action: 'Retrieve custom field cards including their definitions and categories',
			},
			{
				name: 'Get Categories',
				value: 'getCategories',
				description: 'Retrieve custom field categories',
				action: 'Retrieve custom field categories',
			},
			{
				name: 'Get Definitions',
				value: 'getDefinitions',
				description: 'Retrieve custom field definitions',
				action: 'Retrieve custom field definitions',
			},
			{
				name: 'Get Field Values',
				value: 'getFieldValues',
				description: 'Retrieve the values of a custom field for a user',
				action: 'Retrieve the values of a custom field for a user',
			},
			{
				name: 'Get Profile by Card',
				value: 'getProfileByCard',
				description: 'Retrieve the values of a custom field card profile for a user',
				action: 'Retrieve the values of a custom field card profile for a user',
			},
			{
				name: 'Get Profiles',
				value: 'getProfiles',
				description: 'Retrieve custom field profiles of a user',
				action: 'Retrieve custom field profiles of a user',
			},
			{
				name: 'Get Profiles (Expanded)',
				value: 'getProfilesExpanded',
				description: 'Retrieve custom field profiles including their values',
				action: 'Retrieve custom field profiles including their values',
			},
			{
				name: 'Get Store',
				value: 'getStore',
				description: 'Retrieve the complete custom field store of a user',
				action: 'Retrieve the complete custom field store of a user',
			},
			{
				name: 'Get Store Values',
				value: 'getStoreValues',
				description: 'Get all custom field values of a user for a given profile',
				action: 'Get all custom field values of a user for a given profile',
			},
			{
				name: 'Set Field Value',
				value: 'setFieldValue',
				description: 'Set the value of a single custom field for a user',
				action: 'Set the value of a single custom field for a user',
			},
			{
				name: 'Set Multiple Field Values',
				value: 'setMultipleFieldValues',
				description: 'Set multiple custom field values for a user in one request',
				action: 'Set multiple custom field values for a user in one request',
			},
			{
				name: 'Update Profile Field',
				value: 'updateProfileField',
				description: 'Update a custom field value within a profile of a custom field card',
				action: 'Update a custom field value within a profile of a custom field card',
			},
			{
				name: 'Upload File From URL',
				value: 'createFileUploadTarget',
				description: 'Upload a file from a public URL and append it to a custom field',
				action: 'Upload a file from a public URL and append it to a custom field',
			},
		],
	},
	{
		displayName: 'User Name or ID',
		name: 'userId',
		type: 'options',
		typeOptions: {
			loadOptionsMethod: 'member_getMembers',
		},
		required: true,
		default: '',
		description:
			'The ID of the user whose custom field data should be accessed. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: [
					'getFieldValues',
					'getProfileByCard',
					'getProfiles',
					'getProfilesExpanded',
					'getStore',
					'getStoreValues',
					'setFieldValue',
					'setMultipleFieldValues',
					'createFileUploadTarget',
					'updateProfileField',
				],
			},
		},
	},
	{
		displayName: 'Card Name or ID',
		name: 'customFieldCardId',
		type: 'options',
		default: '',
		description:
			'Filter results by a specific custom field card. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getCards',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getCategories', 'getDefinitions', 'getProfiles', 'getProfilesExpanded'],
			},
		},
	},
	{
		displayName: 'Card Name or ID',
		name: 'customFieldCardId',
		type: 'options',
		required: true,
		default: '',
		description:
			'The custom field card to use. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getCards',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getProfileByCard', 'updateProfileField'],
			},
		},
	},
	{
		displayName: 'Profile ID',
		name: 'profileId',
		type: 'string',
		default: '',
		description:
			'If specified, the profile with this ID is used. Takes precedence over Profile Index and Profile Name.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: [
					'setFieldValue',
					'setMultipleFieldValues',
					'getProfileByCard',
					'updateProfileField',
					'createFileUploadTarget',
				],
			},
		},
	},
	{
		displayName: 'Profile Index',
		name: 'profileIndex',
		type: 'number',
		default: null,
		description:
			'If specified, the profile with this index is used. Ignored if Profile ID is set. Takes precedence over Profile Name. If not specified or if the index does not exist for a given field key, the value in the default/first profile is returned.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: [
					'setFieldValue',
					'updateProfileField',
					'setMultipleFieldValues',
					'createFileUploadTarget',
					'getProfileByCard',
					'getStoreValues',
				],
			},
		},
	},
	{
		displayName: 'Profile Name',
		name: 'profileName',
		type: 'string',
		default: '',
		description:
			'If specified, the first profile with this name is used. Ignored if Profile ID or Profile Index is set.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['updateProfileField', 'getProfileByCard', 'createFileUploadTarget'],
			},
		},
	},
	{
		displayName: 'Field Key Name or ID',
		name: 'fieldKey',
		type: 'options',
		description:
			'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getDefinitions',
			loadOptionsDependsOn: ['customFieldCardId'],
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'getFieldValues', 'updateProfileField'],
			},
		},
		default: '',
	},
	{
		displayName: 'Field Key Name or ID',
		name: 'customFieldKey',
		type: 'options',
		description:
			'The file, image, video, or audio custom field to append to. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getMediaDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['createFileUploadTarget'],
			},
		},
		default: '',
	},
	{
		displayName: 'File Name',
		name: 'customFieldFileName',
		type: 'string',
		default: '',
		placeholder: 'e.g. report.pdf',
		description:
			'Optional title for videos. Also used for files in the custom field file value returned by LearningSuite.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['createFileUploadTarget'],
			},
		},
	},
	{
		displayName: 'Public Download URL',
		name: 'publicDownloadUrl',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'https://example.com/file.pdf',
		description: 'Public URL that LearningSuite downloads and uploads before returning the custom field file value',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['createFileUploadTarget'],
			},
		},
	},
	{
		displayName: 'Field Type Name or ID',
		name: 'fieldType',
		type: 'options',
		default: '',
		description:
			'Automatically detected from the selected field. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldType',
			loadOptionsDependsOn: ['fieldKey'],
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
			},
		},
		options: [],
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueString',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'Enter text value',
		description: 'The string value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['string'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueNumber',
		type: 'number',
		default: 0,
		required: true,
		placeholder: 'Enter numeric value',
		description: 'The numeric value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['number'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueBoolean',
		type: 'boolean',
		default: false,
		required: true,
		description: 'Whether to set a boolean value for this user-defined field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['boolean'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueDateTime',
		type: 'dateTime',
		default: '',
		required: true,
		placeholder: 'Select date/time',
		description: 'The date/time value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['dateTime'],
			},
		},
	},
	{
		displayName: 'Field Value Name or ID',
		name: 'fieldValueOption',
		type: 'options',
		default: '',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldOptions',
			loadOptionsDependsOn: ['fieldKey'],
		},
		description:
			'Select a value from the available options. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['option'],
			},
		},
	},
	{
		displayName: 'Field Value Names or IDs',
		name: 'fieldValueMultiOptions',
		type: 'multiOptions',
		default: [],
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getFieldOptions',
			loadOptionsDependsOn: ['fieldKey'],
		},
		description:
			'Select one or more values from the available options. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['multiOptions'],
			},
		},
	},
	{
		displayName: 'Binary Property',
		name: 'fieldValueBinary',
		type: 'string',
		default: 'data',
		required: true,
		placeholder: 'data',
		description:
			'Name of the binary property containing the file(s) to upload. If the input contains multiple binary properties, separate their names with commas (e.g. "data,file1,file2").',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['files', 'images', 'videos', 'audios'],
			},
		},
	},
	{
		displayName: 'File Value Mode',
		name: 'fileValueMode',
		type: 'options',
		default: 'add',
		description: 'How to handle existing file values in the custom field',
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Append uploaded files and fail if the field limit would be exceeded',
			},
			{
				name: 'Replace',
				value: 'replace',
				description: 'Replace all existing file values with the uploaded files',
			},
			{
				name: 'Replace if Limit Reached',
				value: 'replaceIfFull',
				description: 'Append uploaded files, but replace existing files if the field limit would be exceeded',
			},
		],
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['files', 'images', 'videos', 'audios'],
			},
		},
	},
	{
		displayName: 'File Value Mode',
		name: 'fileValueMode',
		type: 'options',
		default: 'add',
		description: 'How to handle existing file values in the custom field',
		options: [
			{
				name: 'Add',
				value: 'add',
				description: 'Append uploaded files and fail if the field limit would be exceeded',
			},
			{
				name: 'Replace',
				value: 'replace',
				description: 'Replace all existing file values with the uploaded files',
			},
			{
				name: 'Replace if Limit Reached',
				value: 'replaceIfFull',
				description: 'Append uploaded files, but replace existing files if the field limit would be exceeded',
			},
		],
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setMultipleFieldValues', 'createFileUploadTarget'],
			},
		},
	},
	{
		displayName: 'File Name',
		name: 'fieldValueFileName',
		type: 'string',
		default: '',
		placeholder: 'e.g. report.pdf',
		description: 'Optional custom file name. If left empty, the original file name from the binary data is used.',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
				fieldType: ['files'],
			},
		},
	},
	{
		displayName: 'Field Value',
		name: 'fieldValueFallback',
		type: 'string',
		default: '',
		required: true,
		placeholder: 'Enter value',
		description: 'The value to set for this custom field',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setFieldValue', 'updateProfileField'],
			},
			hide: {
				fieldType: [
					'string',
					'number',
					'boolean',
					'dateTime',
					'option',
					'multiOptions',
					'files',
					'images',
					'videos',
					'audios',
				],
			},
		},
	},
	{
		displayName: 'Field Values',
		name: 'fieldValues',
		type: 'resourceMapper',
		noDataExpression: true,
		required: true,
		default: {
			mappingMode: 'defineBelow',
			value: null,
		},
		typeOptions: {
			resourceMapper: {
				resourceMapperMethod: 'getMultipleCustomFieldValueResourceMapperFields',
				mode: 'add',
				fieldWords: {
					singular: 'field',
					plural: 'fields',
				},
				addAllFields: true,
				multiKeyMatch: false,
				supportAutoMap: false,
			},
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['setMultipleFieldValues'],
			},
		},
	},

	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1 },
		default: 50,
		description: 'Max number of results to return',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getCards', 'getCardsExpanded', 'getCategories', 'getDefinitions'],
			},
		},
	},
	{
		displayName: 'Offset',
		name: 'offset',
		type: 'number',
		default: 0,
		description: 'Number of results to skip before starting to return items',
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getCards', 'getCardsExpanded', 'getCategories', 'getDefinitions'],
			},
		},
	},
];
