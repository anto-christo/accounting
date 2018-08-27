<template>
    <div>
        <div class="setup-wizard d-flex justify-content-center">
            <div class="col-4 border rounded shadow-sm p-4 mt-5">
                <div class="frappe-form">
                    <div class="frappe-form-actions d-flex justify-content-between align-items-center p-3 border-bottom">
                        <h5 class="m-0">Connect</h5>
                        <button type="button" :class="['btn','btn-sm','btn-primary']" v-text="btnText" @click="toggleConnect()">Connect</button>
                    </div>
                    <div class="p-4">
                        <form class="frappe-form-layout">
                            <div>
                                <div data-fieldname="masterName" class="form-group">
                                    <label for="masterName" class="text-muted">Server Name</label>
                                    <input id="masterName" type="text" class="form-control" v-model="masterName" :disabled="connectedMaster">
                                </div>
                                <div data-fieldname="email" class="form-group">
                                    <label for="email" class="text-muted">Email</label>
                                    <input id="email" type="email" class="form-control" v-model="email" :disabled="connectedMaster">
                                </div>
                                <div data-fieldname="password" class="form-group">
                                    <label for="password" class="text-muted">Password</label>
                                    <input id="password" type="password" class="form-control" v-model="password" :disabled="connectedMaster">
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
import WebRTC from "frappejs/webrtc/webrtc";
import WebRTCClient from 'frappejs/backends/webrtc'; 
export default {
    name: 'ConnectSettings',
    data(){
        return {
            btnText: "Connect",
            badgeColor: "badge-danger",
            badgeText: "Disconnected",
            webRTC: frappe.webRTC,
            masterName: null,
            email: null,
            password: null,
            connectedMaster: false
        };
    },

    async created(){
        this.webRTC.onConnectionResponse = status => {
            console.log("Connection Response", status);
            if(status == true && this.masterName){
                this.webRTC.requestAccess(this.email, this.password);
            }
            else{
                this.btnText = 'Connect';
                this.badgeColor = 'btn-danger';
                this.badgeText = 'Disconnected';
                this.connectedMaster = false;
                if(status == 'fail'){
                    //this.showError('The server is not live or does not exist');
                }
            }
        }

        this.webRTC.onAccessResponse = status => {
            console.log("Access Response", status);
            if(status == true){
                this.btnText = 'Disconnect';
                this.badgeColor = 'btn-success';
                this.badgeText = 'Connected';
                this.connectedMaster = true;
                frappe.db = new WebRTCClient();
            }
            else{
                if(status == 'fail'){
                    //this.showError('You are not authorized to connect with this server');
                }
            }
        }
    },

    methods: {
        toggleConnect: function(){
            if(this.btnText == 'Connect'){
                this.webRTC.startConnection(this.masterName);
            }
            else{
                this.webRTC.stopConnection();
            }
        },
    }
}
</script>