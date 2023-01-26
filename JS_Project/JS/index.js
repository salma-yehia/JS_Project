window.addEventListener("load", function() {
    let nameTextBox = document.querySelector("input[name]");
    let goButton = document.querySelector("input[value=Go]");

    goButton.addEventListener("click", (event) => {
        if (!nameTextBox.value) {
            document.querySelector("#nameError").innerText = "Enter name";
            document.querySelector("#nameError").style.display = "inline";
            event.preventDefault();
        }
    });
});