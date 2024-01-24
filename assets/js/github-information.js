function userInformationHTML(user) {
    return `
    <h2> ${user.name}
        <span class="small-name">
            (@<a href="${user.html_url}" target="_blank">${user.login}</a>)
        </span>
    </h2>
        <div class="gh-content">
            <div class="gh-avatar">
                <a href="${user.html_url}" target="_blank">
                    <img src="${user.avatar_url}" width="80" height="80" alt="${user.login}"/>
                </a>
            </div>
            <p>Followers: ${user.followers} - Following: ${user.following} <br> Repos: ${user.public_repos}</p>
        </div>`;
};

function repoInformationHTML(repos) {
    if (repos.length == 0) {
        return `<div class="clearfix repo-list">No repos!</div>`;
    }
    //map() works like a forEach but returns an array with results of the function
    var listItemsHTML = repos.map(function(repo) {
        return `<li>
                    <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                </li>`
    });
    return `<div class="clearfix repo-list">
                <p>
                    <strong>Repo List:</strong>
                </p>
                <ul>
                    ${listItemsHTML.join("\n")}
                </ul>
            </div>`
}

function fetchGitHubInformation(event) {

    //clear divs when the textbox is empty
    $("#gh-user-data").html("");
    $("#gh-repo-data").html("");

    var username = $("#gh-username").val();
    if(!username) {
        $("#gh-user-data").html(`<h2>Please enter a GitHub username</h2`);
        return;
    }

    $("#gh-user-data").html(
        `<div id="loader">
            <img src="assets/css/loader.gif" alt="...loading"/>
        </div>`);

    $.when(
        $.getJSON(`https://api.github.com/users/${username}`),
        $.getJSON(`https://api.github.com/users/${username}/repos`)

        //now there are 2 JSON calls, you need 2 responses in first function
        ).then(function(firstResponse, secondResponse) {
            var userData = firstResponse[0];
            var repoData = secondResponse[0];
            $("#gh-user-data").html(userInformationHTML(userData));
            $("#gh-repo-data").html(repoInformationHTML(repoData));
        }, function(errorResponse) {
            if (errorResponse.status == 404) {
                $("#gh-user-data").html(`<h2>No info found for user ${username}</h2>`)
                //Print a more user friendly throttle message
            } else if (errorResponse.status == 403) {
                var resetTime = new Data(errorResponse.getResponseHeader("X-RateLimit-Reset")* 1000);
                //X-RateLimit-Reset is a header provided by GitHub to let us know when our quota will be reset
                //and can start usingthe API again. Presented as UNIX timestamp
                //need to x1000 then turn into a date object to get into a readable format
                $("gh-user-data").html(`<h4>Too many requests, please wait until ${resetTime.toLocaleTimeString()}`)
                //toLocaleTimeString() picks up your location and prints local time
            } else {
                console.log(errorResponse);
                $("gh-user-data").html(
                    `<h2>Error: ${errorResponse.responseJSON.message}</h2>`
                );
            }
        })
}

//have octocat profile displaying when page is loaded
$(document).ready(fetchGitHubInformation);