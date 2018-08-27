<template>
    <div>
        <div class="setup-wizard d-flex justify-content-center">
            <div class="col-4 border rounded shadow-sm p-4 mt-5">
                <div class="frappe-form">
                    <div class="frappe-form-actions d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 class="m-0">Server</h5>
                        <button type="button" :class="['btn','btn-sm','btn-primary']" v-text="btnText" @click="toggleServer()"></button>
                    </div>
                    <div class="p-4">
                        <form class="frappe-form-layout">
                            <div>
                                <div data-fieldname="serverName" class="form-group">
                                    <label for="serverName" class="text-muted">Server Name</label>
                                    <input id="serverName" type="text" class="form-control" v-model="serverName" :disabled="addDisable" placeholder="Enter your preferred server name to register">
                                </div>
                            </div>
                        </form>
                        <center><span :class="['badge',badgeColor]" v-text="badgeText"></span></center>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import frappe from "frappejs";
import App from '../../App.vue';
import WebRTC from 'frappejs/webrtc/webrtc';
export default {
    data(){
        return {
            addDisable: true,
            btnText: localStorage.serverStatus == 'off'? "Start": "Stop" || "Start",
            badgeColor: localStorage.serverStatus == 'off'? "badge-danger": "badge-success" || "badge-danger",
            badgeText: localStorage.serverStatus == 'off'? "Stopped": "Running" || "Stopped",
            webRTC: frappe.webRTC,
            serverName: null
        };
    },

    async created(){
        this.checkRegister();

        this.webRTC.onServerResponse = status => {
            console.log("Server Response:",status);
            if(status == true){
                this.addDisable = true;
                this.btnText = "Stop";
                this.badgeColor = "badge-success";
                this.badgeText = "Running"
            }
            else{
                this.btnText = "Start";
                this.badgeColor = "badge-danger";
                this.badgeText = "Stopped"
                if(status == 'exists'){
                    //this.showError('This server name already exists');
                }
            }
        }
        frappe.throw('ValueError', 'The server name already exists', new Error().stack);
    },

    methods: {
        toggleServer: function(){
            if(localStorage.serverStatus == 'off' || localStorage.serverStatus == undefined){
                this.webRTC.startServer(this.serverName);
            }
            else{
                this.webRTC.stopServer(this.serverName);
            }
        },

        checkRegister: function(){
            frappe.getSingle('ServerSettings').then(serverSettings => {
                if(serverSettings.serverName != undefined){
                    this.serverName = serverSettings.serverName;
                }
                else{
                    this.addDisable = false;
                }
            });
        },
    }
}
</script>