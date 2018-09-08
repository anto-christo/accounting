import { _ } from 'frappejs/utils';
import countryInfo from '../../../fixtures/countryInfo.json';
import { getSettings } from '../../../electron/settings';

const countryList = Object.keys(countryInfo).sort();
const userSettings = getSettings();
let serverNames = userSettings.serverNames;
if(!serverNames) {
  serverNames = [];
}

const selectStorage = {
  title: 'Choose storage option',
  columns: [
    { fields: ['storageOption'] }
  ]
};
const selectFolder = {
  title: 'Choose a folder',
  columns: [
    { fields: ['folder'] }
  ]
};
const selectFile = {
  title: 'Choose a file',
  columns: [
    { fields: ['file'] }
  ]
};
const serverSettings = {
  title: 'Connect to server',
  columns: [
    { fields: ['masterName', 'verifyEmail', 'verifyPassword'] }
  ]
};
const selectCountry = {
  title: 'Select Country',
  columns: [
    { fields: ['country'] }
  ]
};
const addCompany = {
  title: 'Add your Company',
  columns: [
    { fields: ['companyName', 'bankName', 'fiscalYearStart', 'fiscalYearEnd'] }
  ]
};

export default {
  fields: [
    {
      fieldname: 'storageOption',
      label: 'Choose storage option',
      fieldtype: 'Select',
      options: [
        'Create new storage',
        'Open existing storage',
        'Connect to server'
      ],
      default: 'Create new storage',
      required: 1
    },

    {
      fieldname: 'folder',
      label: _('Folder Location'),
      fieldtype: 'File',
      placeholder: _('Select Folder'),
      required: 1,
      directory: 1,
    },

    {
      fieldname: 'file',
      label: _('File Location'),
      fieldtype: 'File',
      placeholder: _('Select File'),
      required: 1,
    },

    {
      fieldname: 'masterName',
      label: 'Server Name',
      fieldtype: 'Autocomplete',
      required: 1,
      getList: () => serverNames
    },

    {
      fieldname: 'verifyEmail',
      label: 'Email',
      fieldtype: 'Data',
      required: 1,
    },

    {
      fieldname: 'verifyPassword',
      label: 'Password',
      fieldtype: 'Password',
      required: 1,
    },

    {
      fieldname: 'country',
      label: 'Country',
      fieldtype: 'Autocomplete',
      required: 1,
      getList: () => countryList
    },

    {
      fieldname: 'companyName',
      label: 'Company Name',
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'bankName',
      label: 'Bank Name',
      fieldtype: 'Data',
      required: 1
    },

    {
      fieldname: 'fiscalYearStart',
      label: 'Fiscal Year Start Date',
      fieldtype: 'Date',
      required: 1
    },

    {
      fieldname: 'fiscalYearEnd',
      label: 'Fiscal Year End Date',
      fieldtype: 'Date',
      required: 1
    },
  ],
  
  layout: {
    paginated: true,
    sections: [selectStorage, selectFolder, selectCountry, addCompany]
  },

  showNewSetup: function() {
    this.layout.sections = [];
    this.layout.sections.push(...[selectStorage, selectFolder, selectCountry, addCompany]);
  },

  showExistingSetup: function() {
    this.layout.sections = [];
    this.layout.sections.push(...[selectStorage, selectFile, selectCountry, addCompany]);
  },

  showServerSetup: function() {
    this.layout.sections = [];
    this.layout.sections.push(...[selectStorage, serverSettings]);
  },
}
