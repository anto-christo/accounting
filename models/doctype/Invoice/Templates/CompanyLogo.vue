<template>
    <div v-if="logoPresent">
        <img :src="logoPath" height="100px" />
    </div>
</template>
<script>
export default {
    name: 'CompanyLogo',
    data() {
        return {
            logoPath: null,
            logoPresent: true
        }
    },
    async created() {
        this.getLogo();
    },
    methods: {
        async getLogo() {
            let companyDetails = await frappe.getDoc('CompanySettings');
            try {
                this.logoPath = companyDetails.logo;
            } catch(e) {
                this.logoPresent = false;
            }
        }
    }
}
</script>