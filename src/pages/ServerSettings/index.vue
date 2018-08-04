<template>
    <div>
        <div class="setup-wizard d-flex justify-content-center">
            <div class="col-4 border rounded shadow-sm p-4 mt-5">
                <div class="frappe-form">
                    <div class="frappe-form-actions d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 class="m-0">Server</h5>
                        <button type="button" :class="['btn','btn-sm','btn-primary']" v-text="btnText" @click="toggleServer()"></button>
                    </div>
                    <div class="p-3">
                        <form class="frappe-form-layout">
                            <div>
                                <div data-fieldname="serverName" class="form-group">
                                    <label for="serverName" class="text-muted">Server Name</label>
                                    <input id="serverName" type="text" class="form-control" v-model="serverName" :disabled="addDisable" placeholder="Enter your preferred server name to register">
                                </div>
                            </div>
                        </form>
                        <table class="table table-borderless">
                            <tbody>
                                <tr>
                                    <td>Status</td>
                                    <td><span :class="['badge','float-right',badgeColor]" v-text="badgeText"></span></td>
                                </tr>
                            </tbody>
                        </table>
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
            btnText: localStorage.serverStatus == 'off'? "Start": "Stop",
            badgeColor: localStorage.serverStatus == 'off'? "badge-danger": "badge-success",
            badgeText: localStorage.serverStatus == 'off'? "Stopped": "Running",
            webRTC: frappe.webRTC,
            serverName: null
        };
    },

    async created(){
        this.checkRegister();

        this.webRTC.onServerResponse = status => {
            console.log("Server Response:",status);
            if(status){
                this.addDisable = true;
                this.btnText = "Stop";
                this.badgeColor = "badge-success";
                this.badgeText = "Running"
            }
            else{
                this.btnText = "Start";
                this.badgeColor = "badge-danger";
                this.badgeText = "Stopped"
            }
        }
    },

    methods: {
        toggleServer: function(){
            if(localStorage.serverStatus == 'off'){
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
            })
        }
    }
}
</script>