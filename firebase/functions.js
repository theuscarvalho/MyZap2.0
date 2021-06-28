/*##############################################################################
# File: functions.js                                                           #
# Project: myzap2.0                                                            #
# Created Date: 2021-06-21 18:41:44                                            #
# Author: Eduardo Policarpo                                                    #
# Last Modified: 2021-06-28 00:20:49                                           #
# Modified By: Eduardo Policarpo                                               #
##############################################################################*/

'use strict';

const firebase = require('./db');
const SessionsDB = require('./model');
const firestore = firebase.firestore();

module.exports = class Firebase {

    static async addSession(req, res, next) {
        try {
            const data = req.body;
            await firestore.collection('Sessions').doc(req.body.session).set(data);
            res.send('Record saved successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async getAllSessions(req, res, next) {
        try {
            const Sessions = await firestore.collection('Sessions');
            const data = await Sessions.get();
            const SessionsArray = [];
            if (data.empty) {
                res.status(404).send('No Session record found');
            } else {
                data.forEach(doc => {
                    const Session = new SessionsDB(
                        doc.id,
                        doc.data().session,
                        doc.data().apitoken,
                        doc.data().sessionkey,
                        doc.data().wh_status,
                        doc.data().wh_message,
                        doc.data().wh_qrcode,
                        doc.data().wh_connect,
                        doc.data().WABrowserId,
                        doc.data().WASecretBundle,
                        doc.data().WAToken1,
                        doc.data().WAToken2
                    );
                    SessionsArray.push(Session);
                });
                res.send(SessionsArray);
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async getSession(req, res, next) {
        try {
            const id = req.body.id;
            const Session = await firestore.collection('Sessions').doc(id);
            const data = await Session.get();
            if (!data.exists) {
                res.status(404).send('Session with the given ID not found');
            } else {
                res.send(data.data());
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async updateSession(req, res, next) {
        try {
            const id = req.body.id;
            const data = req.body;
            const Session = await firestore.collection('Sessions').doc(id);
            await Session.update(data);
            res.send('Session record updated successfuly');
        } catch (error) {
            res.status(400).send(error.message);
        }
    }

    static async deleteSession(req, res, next) {
        try {
            const id = req.body.id;
            if (!id) {
                res.status(400).send('Session não informada');
            }
            else {
                await firestore.collection('Sessions').doc(id).delete();
                res.send('Record deleted successfuly');
            }
        } catch (error) {
            res.status(400).send(error.message);
        }
    }
}