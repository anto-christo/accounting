<template>
    <component :themeColor="color" :is="invoiceTemplate" v-if="doc" :doc="doc"/>
</template>
<script>
import InvoiceTemplate1 from '@/../models/doctype/Invoice/Templates/InvoiceTemplate1';
import InvoiceTemplate2 from '@/../models/doctype/Invoice/Templates/InvoiceTemplate2';
import InvoiceTemplate3 from '@/../models/doctype/Invoice/Templates/InvoiceTemplate3';

const invoiceTemplates = {
  'Basic I': InvoiceTemplate1,
  'Basic II': InvoiceTemplate2,
  'Modern': InvoiceTemplate3
};

export default {
  name: 'InvoicePrint',
  props: ['doc', 'themeColor', 'template'],
  data() {
    return {
      color: null,
      invoiceTemplate: null
    };
  },
  watch: {
    themeColor: async function() {
      await this.loadInvoice();
    },
    template: async function() {
      await this.loadInvoice();
    }
  },
  async created() {
    this.color = await this.getColor();
    this.invoiceTemplate = await this.getTemplate();
    await this.loadInvoice();
  },
  methods: {
    async loadInvoice() {
      if (this.themeColor) this.color = this.themeColor;
      console.log(this.template);
      if (this.template) this.invoiceTemplate = this.template;
      console.log(this.invoiceTemplate);
      this.invoiceTemplate = invoiceTemplates[this.invoiceTemplate];
    },
    async getTemplate() {
      let invoiceSettings = await frappe.getDoc('InvoiceSettings');
      return invoiceSettings.template;
    },
    async getColor() {
      let invoiceSettings = await frappe.getDoc('InvoiceSettings');
      return invoiceSettings.themeColor;
    }
  }
};
</script>