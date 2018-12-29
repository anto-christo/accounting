<template>
  <div v-if="doc">
    <h4 class="mb-3">{{ title }}</h4>
    <form-layout
      :doc="doc"
      :fields="fields"
      @updateDoc="saveDoc"
    />
  </div>
</template>
<script>
import FormLayout from 'frappejs/ui/components/Form/FormLayout';
import { exec } from 'child_process';
export default {
  name: 'SettingSection',
  props: ['doctype'],
  components: {
    FormLayout
  },
  data() {
    return {
      doc: null,
      title: '',
      fields: []
    }
  },
  async mounted() {
    this.doc = await frappe.getDoc(this.doctype);
    const meta = frappe.getMeta(this.doctype);
    this.fields = meta.fields;
    this.title = meta.label;
  },
  methods: {
    async saveDoc(updated) {
      const { fieldname, value } = updated;
      if (value instanceof FileList) {
        const base64  = await this.encodeImageFileAsURL(value);
        this.doc['logo'] = base64;
      } 
      this.doc.update();
      this.$toasted.show('Saved');
    },
    async encodeImageFileAsURL(element) {
      var file = element[0];
      var reader = new FileReader();
      reader.readAsDataURL(file);
      return new Promise((resolve, reject) => {
        reader.onloadend = function() {
          resolve(reader.result);
        }
      });
    }
  }
}
</script>
