// Add your API endpoint here
var API_ENDPOINT = "https://a99lai6imb.execute-api.us-east-2.amazonaws.com/prod";

// AJAX POST request to save student data
document.getElementById("savestudent").onclick = function() {
    var inputData = {
        "studentid": $('#studentid').val(),
        "name": $('#name').val(),
        "class": $('#class').val(),
        "age": $('#age').val()
    };

    // Ensure all fields are filled
    if (!inputData.studentid || !inputData.name || !inputData.class || !inputData.age) {
        alert("Please fill in all fields.");
        return;
    }

    $.ajax({
        url: API_ENDPOINT,  // Updated to the new URL
        type: 'POST',
        data: JSON.stringify(inputData),
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            document.getElementById("studentSaved").innerHTML = "Student Data Saved!";
        },
        error: function(xhr, status, error) {
            console.error("Error saving student data:", xhr.responseText);
            alert("Error saving student data.");
        }
    });
};

// AJAX GET request to retrieve all students
document.getElementById("getstudents").onclick = function() {
    $.ajax({
        url: API_ENDPOINT,  // Updated to the new URL
        type: 'GET',
        contentType: 'application/json; charset=utf-8',
        success: function(response) {
            $('#studentTable tr').slice(1).remove();  // Clear existing rows (except header)
            // Populate table with student data
            jQuery.each(response, function(i, data) {
                $("#studentTable").append("<tr>" +
                    "<td>" + data['studentid'] + "</td>" +
                    "<td>" + data['name'] + "</td>" +
                    "<td>" + data['class'] + "</td>" +
                    "<td>" + data['age'] + "</td>" +
                    "</tr>");
            });
        },
        error: function(xhr, status, error) {
            console.error("Error retrieving student data:", xhr.responseText);
            alert("Error retrieving student data.");
        }
    });
};
