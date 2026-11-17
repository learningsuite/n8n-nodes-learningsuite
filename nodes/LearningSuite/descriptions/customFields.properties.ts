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
				action: 'Get custom field cards',
			},
			{
				name: 'Get Cards (Expanded)',
				value: 'getCardsExpanded',
				description: 'Retrieve custom field cards including their definitions and categories',
				action: 'Get custom field cards with definitions',
			},
			{
				name: 'Get Categories',
				value: 'getCategories',
				description: 'Retrieve custom field categories',
				action: 'Get custom field categories',
			},
			{
				name: 'Get Definitions',
				value: 'getDefinitions',
				description: 'Retrieve custom field definitions',
				action: 'Get custom field definitions',
			},
			{
				name: 'Get Field Files',
				value: 'getFieldFiles',
				description: 'Retrieve the files of a file custom field for a user, with download URLs',
				action: 'Get custom field files',
			},
			{
				name: 'Get Field Values',
				value: 'getFieldValues',
				description: 'Retrieve the values of a custom field for a user',
				action: 'Get custom field values',
			},
			{
				name: 'Get File',
				value: 'getFile',
				description: 'Retrieve a custom field file of a user with a download URL',
				action: 'Get custom field file',
			},
			{
				name: 'Get Profile by Card',
				value: 'getProfileByCard',
				description: 'Retrieve the values of a custom field card profile for a user',
				action: 'Get custom field profile by card',
			},
			{
				name: 'Get Profiles',
				value: 'getProfiles',
				description: 'Retrieve custom field profiles of a user',
				action: 'Get custom field profiles',
			},
			{
				name: 'Get Profiles (Expanded)',
				value: 'getProfilesExpanded',
				description: 'Retrieve custom field profiles including their values',
				action: 'Get custom field profiles with values',
			},
			{
				name: 'Get Store',
				value: 'getStore',
				description: 'Retrieve the complete custom field store of a user',
				action: 'Get custom field store',
			},
			{
				name: 'Get Store Values',
				value: 'getStoreValues',
				description: 'Get all custom field values of a user for a given profile',
				action: 'Get custom field store values',
			},
			{
				name: 'Set Field Value',
				value: 'setFieldValue',
				description: 'Set the value of a single custom field for a user',
				action: 'Set custom field value',
			},
			{
				name: 'Set Multiple Field Values',
				value: 'setMultipleFieldValues',
				description: 'Set multiple custom field values for a user in one request',
				action: 'Set multiple custom field values',
			},
			{
				name: 'Update Profile Field',
				value: 'updateProfileField',
				description: 'Update a custom field value within a profile of a custom field card',
				action: 'Update custom field in profile',
			},
			{
				name: 'Upload File From URL',
				value: 'createFileUploadTarget',
				description: 'Upload a file from a public URL and append it to a custom field',
				action: 'Upload file from URL to custom field',
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
					'getFieldFiles',
					'getFieldValues',
					'getFile',
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
		displayName: 'Field Key Names or IDs',
		name: 'fieldKeys',
		type: 'multiOptions',
		default: [],
		description:
			'Only return the definitions with these keys (max. 50). Leave empty to return all. Choose from the list, or specify IDs using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'customFields_getDefinitions',
			loadOptionsDependsOn: ['customFieldCardId'],
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getDefinitions'],
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
		displayName: 'Field Key Name or ID',
		name: 'customFieldKey',
		type: 'options',
		description:
			'The file, image, video, or audio custom field to read. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		required: true,
		typeOptions: {
			loadOptionsMethod: 'customFields_getMediaDefinitions',
		},
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getFieldFiles'],
			},
		},
		default: '',
	},
	{
		displayName: 'File ID',
		name: 'fileId',
		type: 'string',
		required: true,
		default: '',
		description:
			"The file ID from a file value of the user's custom field store (fileId). Only files currently set in one of the user's custom field values can be retrieved.",
		displayOptions: {
			show: {
				resource: ['customFields'],
				operation: ['getFile'],
			},
		},
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
		placeholder: 'e.g. https://example.com/file.pdf',
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
		placeholder: 'e.g. Gold',
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
		placeholder: 'e.g. 42',
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
		placeholder: 'e.g. data',
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
		placeholder: 'e.g. Gold',
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
