<template>
	<div id="app">
	<frappe-desk v-if="showDesk" :sidebarConfig="sidebarConfig">
		<router-view />
	</frappe-desk>
	<setup-wizard v-if="showSetupWizard" @complete="afterSetupWizard"/>
	</div>
</template>

<script>
import frappe from 'frappejs';
import io from 'socket.io-client';
import common from 'frappejs/common';
import coreModels from 'frappejs/models';
import models from '../models';
import SQLite from 'frappejs/backends/sqlite';
import postStart from '../server/postStart';
import { getSettings, saveSettings } from '../electron/settings';
import WebRTC from 'frappejs/webrtc/webrtc';
import WebRTCClient from 'frappejs/backends/webrtc';

import Observable from 'frappejs/utils/observable';
import Desk from 'frappejs/ui/components/Desk';
import SetupWizard from './pages/SetupWizard';
import sidebarConfig from './sidebarConfig';
import '../electron/plugins';

import importCOA from '../models/doctype/account/importCOA';
import standardChartOfAccounts from '../fixtures/standardCOA';

frappe.init();
frappe.registerLibs(common);
frappe.registerModels(coreModels);
frappe.registerModels(models);
frappe.fetch = window.fetch.bind();
frappe.isServer = true;
frappe.events = new Observable();
frappe.throw = frappe.errors.throw;
frappe.webRTC = new WebRTC(io.connect('http://159.65.158.36:8002'));

export default {
    name: 'App',
    data() {
        return {
            showDesk: false,
            showSetupWizard: false,
            sidebarConfig
        }
    },
    components: {
        FrappeDesk: Desk,
        SetupWizard
    },
    async created() {
        const userSettings = getSettings();

        if (!userSettings.lastDbPath) {
            this.$router.push('/setup-wizard');
            this.showSetupWizard = true;
        } else {
            await frappe.login('Administrator');
            await this.initializeDb(userSettings.lastDbPath);
            await this.loginToDesk();
        }
    },
    methods: {
        async afterSetupWizard(values) {
            await frappe.login('Administrator');
            await this.connectToDb(values);
            await this.loginToDesk();
        },

        async loginToDesk() {
            await frappe.getSingle('SystemSettings');
            await postStart();
            this.$router.push('/list/ToDo');
            this.showSetupWizard = false;
            this.showDesk = true;
        },

        async saveAccountingSettings(values) {
            const doc = await frappe.getSingle('AccountingSettings');
            console.log(doc);
            if (doc.companyName) {
                return;
            }

            const {
                companyName,
                country,
                name,
                email,
                abbreviation,
                bankName,
                fiscalYearStart,
                fiscalYearEnd
            } = values;

            await doc.set({
                companyName,
                country,
                fullname: name,
                email,
                bankName,
                fiscalYearStart,
                fiscalYearEnd
            });
            await doc.update();
        },

        async bootstrapChartOfAccounts() {
            await importCOA(standardChartOfAccounts);
        },

        async connectToDb(values) {
            console.log(values);
            const {
                folder,
                file,
                companyName,
                masterName,
                verifyEmail,
                verifyPassword
            } = values;

            if (masterName) {
                console.log(masterName);
                frappe.webRTC.startConnection(masterName);
                await this.webrtcHandlers(verifyEmail, verifyPassword);
                let fileContents = getSettings();
                if(!fileContents.serverNames) {
                    fileContents["serverNames"] = [];
                }
                if(fileContents.serverNames.indexOf(masterName) == -1) {
                    fileContents.serverNames.push(masterName);
                }
                await saveSettings(fileContents);
            } else {
                let dbPath;
                if (folder) {
                    dbPath = folder[0].path + '/' + frappe.slug(companyName) + '.db';
                    await this.saveAccountingSettings(values);
                    await this.bootstrapChartOfAccounts();
                } else {
                    dbPath = file[0].path;
                }
                await this.initializeDb(dbPath);
                await saveSettings({
                    lastDbPath: dbPath
                });
            }
        },

        async initializeDb(dbPath) {
            frappe.db = new SQLite({
                dbPath
            });
            await frappe.db.connect();
			await frappe.db.migrate();
        },

        async webrtcHandlers(verifyEmail, verifyPassword) {
            console.log('in web');
            await this.connectionHandler(verifyEmail, verifyPassword);
        },

        async connectionHandler(verifyEmail, verifyPassword) {
            console.log('in conn');
            return new Promise((resolve, reject) => {
                frappe.webRTC.onConnectionResponse = status => {
                    console.log("Connection Response", status);
                    if (status == true) {
                        frappe.webRTC.requestAccess(verifyEmail, verifyPassword);
                        this.accessHandler().then(() => {
                                resolve();
                            })
                            .catch(() => {
                                reject();
                            });
                    } else {
                        if (status == 'fail') {
                            frappe.throw('The server is not live or does not exist', 'NotFound');
                            reject();
                        }
                    }
                };
            });
        },

        async accessHandler() {
            return new Promise((resolve, reject) => {
                frappe.webRTC.onAccessResponse = status => {
                    console.log("Access Response", status);
                    if (status == true) {
                        frappe.db = new WebRTCClient();
                        resolve();
                    } else {
                        if (status == 'fail') {
                            frappe.throw('You are not authorized to connect with this server', 'ValidationError');
                            reject();
                        }
                    }
                }
            });
        }
    }
}
</script>

<style lang="scss">
@import "~bootstrap/scss/bootstrap";
@import '~frappe-datatable/dist/frappe-datatable';

html {
	font-size: 14px;
}

/* style fixes for issues that occur only in electron */
.frappe-desk {
	height: 100vh;
	overflow: hidden;
}

.frappe-list-form {
	height: calc(100vh - 4rem);
}

.frappe-list {
	height: 100%;
	overflow: auto;
}

.frappe-list-actions {
	position: sticky;
	top: 0;
	z-index: 100;
	background-color: #fff;
}

.frappe-form {
	height: 100%;

	.p-3:nth-child(2) {
	height: 100%;
	overflow: auto;
	padding-bottom: 5rem !important;
	}
}

.flatpickr-weekdaycontainer {
	display: flex;
	flex: 1;
}

</style>
