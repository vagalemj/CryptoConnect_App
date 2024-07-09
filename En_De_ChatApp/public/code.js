// code.js

(function(){

    const app = document.querySelector(".app");
    const socket = io();
    
    let uname = "Guest"; // Default username
    
    // Remove join screen and show chat screen
    app.querySelector(".join-screen").classList.remove("active");
    app.querySelector(".chat-screen").classList.add("active");

    // Function to render a message in the chat window
    function renderMessage(type, message) {
        let messageContainer = app.querySelector(".chat-screen .messages");
        if (type === "my") {
            let el = document.createElement("div");
            el.setAttribute("class", "message my-message");
            el.innerHTML = `
                <div>
                    <div class="name">You</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "other") {
            let el = document.createElement("div");
            el.setAttribute("class", "message other-message");
            el.innerHTML = `
                <div>
                    <div class="name">${message.username}</div>
                    <div class="text">${message.text}</div>
                </div>
            `;
            messageContainer.appendChild(el);
        } else if (type === "update") {
            let el = document.createElement("div");
            el.setAttribute("class", "update");
            el.innerText = message;
            messageContainer.appendChild(el);
        }
        // Scroll to the bottom of the chat window
        messageContainer.scrollTop = messageContainer.scrollHeight - messageContainer.clientHeight;
    }

    // Event listener for sending a message
    app.querySelector(".chat-screen #send-message").addEventListener("click", function(){ 
        let message = app.querySelector(".chat-screen #message-input").value;
        if (message.length === 0) {
            return;
        }
        // Render the sent message locally
        renderMessage("my", {
            username: uname,
            text: message
        });
        // Emit the message to the server
        socket.emit("chat", {
            username: uname,
            text: message
        });
        // Clear the message input field
        app.querySelector(".chat-screen #message-input").value = "";
    });

    // Event listener for exiting the chat
    app.querySelector(".chat-screen #exit-chat").addEventListener("click", function(){
        // Notify the server that the user is exiting
        socket.emit("exituser", uname);
        // Refresh the page
        window.location.href = window.location.href;
    });

    // Socket event listener for receiving updates
    socket.on("update", function(update) {
        renderMessage("update", update);
    });

    // Socket event listener for receiving chat messages
    socket.on("chat", function(message) {
        renderMessage("other", message);
    });

})();
