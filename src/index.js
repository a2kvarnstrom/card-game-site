let server = {"reachable":true};

function loginRedirect() {
    location.href = "login.html";
}

function loginRedirect2() {
    let loginInfo = { "uname": document.getElementById("uname").value, "pass": document.getElementById("pass").value };
    login(loginInfo);
}

function registerRedirect() {
    cpass = "asdasd";
    let regInfo = { "uname": document.getElementById("uname").value, "pass": document.getElementById("pass").value };
    register(regInfo);
}

function register(info) {
    location.href = "more.html";
}

function login(loginfo) {
    let salt;
    let sendata = { "type": "salt", "value": loginfo.uname };
    salt = send(sendata);
    sendata = {"type": "login", "value": loginfo };
    send(sendata);
}

async function send(data) {
    a = JSON.stringify(data);
    if(server.reachable) {
        try {
            /*let response = await fetch("http://pokertexas.duckdns.org:2299", {
                credentials: "same-origin",
                method: "POST",
                body: a,
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            });*/
            console.log(response.text());
            server.reachable = false;
        } catch(a) {console.error("Server Unreachable");}
    }
}