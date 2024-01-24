function sendMail(contactForm) {
    emailjs.send("service_6ct3u5q","template_93vnq5j", {
        "from_name": contactForm.name.value,
        "from_email": contactForm.emailaddress.value,
        "project_request": contactForm.projectsummary.value
    })
    .then(
        function(response) {
            console.log("SUCCESS, response");
        },
        function(error) {
            console.log("FAILED, reponse");
        });
        return false; //To block from loading a new page
}