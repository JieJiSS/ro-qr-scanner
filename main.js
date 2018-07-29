"use strict";

const { app, BrowserWindow, ipcMain, powerSaveBlocker } = require("electron");
const path = require("path");
const url = require("url");

const IS_DEBUG = process.env.NODE_DEBUG === "true";
let POWERSAFE_BLOCKER_STARTED = false, POWERSAFE_BLOCKER_ID = null;

let win = null, foodWindow = null;

const testURL = url.format({
    pathname: path.join(__dirname, "/test.html"),
    protocol: "file:",
    slashes: true
});

function createMainWindow () {
    win = null;
    let mainWin = new BrowserWindow({
        width: 600, 
        height: 540,
        background: "#ffffff",
        show: false,
        resizable: false,
        alwaysOnTop: true,
        x: 100,
        y: 200,
    });
    
    mainWin.on("ready-to-show", () => {
        mainWin.show();
        mainWin.focus();

        if(IS_DEBUG)
            mainWin.webContents.openDevTools();
    });

    mainWin.loadURL(
        url.format({
            pathname: path.join(__dirname, "/index.html"),
            protocol: "file:",
            slashes: true
        })
    );
    
    mainWin.on("closed", () => {
        win = null;
        foodWindow && foodWindow.close();
        foodWindow = null;
    });

    win = mainWin;
    openPowersafeBlocker();
}

function createFoodWindow() {
    foodWindow = null;
    let index = new BrowserWindow({
        width: 800, 
        height: 150,
        background: "white",
        show: true,
        resizable: true,
        x: 0,
        y: 0,
    });

    index.on("ready-to-show", () => {
        index.focus();
    });

    index.loadURL(testURL || "http://192.168.3.151:8848/index-food");

    index.on("closed", () => {
        foodWindow = null;
        win && win.close();
        win = null;
    });

    foodWindow = index;
}

app.on("ready", createMainWindow);

app.on("window-all-closed", () => {
    POWERSAFE_BLOCKER_STARTED && powerSaveBlocker.stop(POWERSAFE_BLOCKER_ID);
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    if (win === null) {
        createMainWindow();
    }
});

ipcMain.on("createFood", function () {
    createFoodWindow();
});

let oldData = "", repeatCount = 0;
ipcMain.on("startFetch", function (_, data) {
    if(foodWindow !== null && data !== oldData) {
        foodWindow.webContents.executeJavaScript(`startFetch('${data}')`);
        oldData = data;
    } else {
        repeatCount += 1;
        if(repeatCount >= 3) {
            oldData = "";
            repeatCount = 0;
        }
    }
});

ipcMain.on("fetchLunchByUser", function (_, name) {
    if(foodWindow !== null)
        foodWindow.webContents.executeJavaScript(`fetchLaunch("${name}")`);
});
ipcMain.on("fetchBfByUser", function (_, name) {
    if(foodWindow !== null)
        foodWindow.webContents.executeJavaScript(`fetchBf("${name}")`);
});

function openPowersafeBlocker() {
    if(POWERSAFE_BLOCKER_STARTED) return;
    POWERSAFE_BLOCKER_ID = powerSaveBlocker.start("prevent-display-sleep");
    if(!powerSaveBlocker.isStarted(POWERSAFE_BLOCKER_ID)) {
        console.log("[ERROR] failed to start powerSafeBlocker.");
        POWERSAFE_BLOCKER_ID = null;
    } else {
        POWERSAFE_BLOCKER_STARTED = true;
    }
}
