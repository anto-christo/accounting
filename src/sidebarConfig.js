const { _ } = require('frappejs/utils');

export default [
  {
    items: [
      {
        label: _('ToDo'), route: '#/list/ToDo'
      },
      {
        label: _('Event'), route: '#/list/Event'
      },
      {
        label: _('User'), route: '#/list/User'
      }
    ]
  },
  {
    title: _('Masters'),
    items: [
      {
        label: _('Item'), route: '#/list/Item'
      },
      {
        label: _('Party'), route: '#/list/Party'
      },
      {
        label: _('Invoice'), route: '#/list/Invoice'
      },
      {
        label: _('Tax'), route: '#/list/Tax'
      },
      {
        label: _('Account'), route: '#/list/Account'
      }
    ]
  },
  {
    title: _('Reports'),
    items: [
      {
        label: _('General Ledger'), route: '#/report/general-ledger'
      }
    ]
  },
  {
    title: _('Settings'),
    items: [
      {
        label: _('Server Settings'), route: '#/server-settings'
      },
      {
        label: _('Peer Connection'), route: '#/connect-settings'
      }
    ]
  }
];
