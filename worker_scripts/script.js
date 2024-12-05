<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Student Data</title>
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
    <style>
        body {
            background-color: #f4f4f4;
            font-family: Arial, sans-serif;
        }

        h1 {
            color: #333;
            text-align: center;
        }

        .container {
            width: 50%;
            margin: 20px auto;
            background-color: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        input[type="text"], input[type="submit"] {
            width: 100%;
            padding: 10px;
            margin: 10px 0;
            box-sizing: border-box;
        }

        input[type="submit"] {
            background-color: #007bff;
            color: white;
            cursor: pointer;
        }

        input[type="submit"]:hover {
            background-color: #0056b3;
        }

        table {
            width: 100%;
            margin-top: 20px;
            border-collapse: collapse;
        }

        table, th, td {
            border: 1px solid #ddd;
        }

        th, td {
            padding: 10px;
            text-align: left;
        }

        th {
            background-color: #f2f2f2;
        }
    </style>
</head>
<body>

    <div class="container">
        <h1>Save and View Student Data</h1>
        
        <label for="studentid">Student ID:</label>
        <input type="text" id="studentid" placeholder="Enter Student ID">

        <label for="name">Name:</label>
        <input type="text" id="name" placeholder="Enter Name">

        <label for="class">Class:</label>
        <input type="text" id="class" placeholder="Enter Class">

        <label for="age">Age:</label>
        <input type="text" id="age" placeholder="Enter Age">

        <input type="submit" id="savestudent" value="Save Student Data">
        <p id="studentSaved" style="color: green;"></p>

        <input type="submit" id="getstudents" value="View All Students">

        <table id="studentTable">
            <thead>
                <tr>
                    <th>Student ID</th>
                    <th>Name</th>
                    <th>Class</th>
                    <th>Age</th>
                </tr>
            </thead>
            <tbody>
                <!-- Data will be populated here -->
            </tbody>
        </table>
    </div>

    <script>
        // API endpoint
        var API_ENDPOINT = "https://a99lai6imb.execute-api.us-east-2.amazonaws.com/prod";

        // Save student data
        $('#savestudent').click(function() {
            var studentData = {
                studentid: $('#studentid').val(),
                name: $('#name').val(),
                class: $('#class').val(),
                age: $('#age').val()
            };

            if (!studentData.studentid || !studentData.name || !studentData.class || !studentData.age) {
                alert("Please fill in all fields!");
                return;
            }

            $.ajax({
                url: API_ENDPOINT,
                type: 'POST',
                contentType: 'application/json',
                data: JSON.stringify(studentData),
                success: function(response) {
                    $('#studentSaved').text("Student data saved successfully!");
                    $('#studentid').val('');
                    $('#name').val('');
                    $('#class').val('');
                    $('#age').val('');
                },
                error: function(xhr, status, error) {
                    alert("Error saving data: " + xhr.responseText);
                }
            });
        });

        // Get all students
        $('#getstudents').click(function() {
            $.ajax({
                url: API_ENDPOINT,
                type: 'GET',
                success: function(response) {
                    $('#studentTable tbody').empty(); // Clear existing table data

                    // Append new rows
                    $.each(response, function(index, student) {
                        $('#studentTable tbody').append(`
                            <tr>
                                <td>${student.studentid}</td>
                                <td>${student.name}</td>
                                <td>${student.class}</td>
                                <td>${student.age}</td>
                            </tr>
                        `);
                    });
                },
                error: function(xhr, status, error) {
                    alert("Error fetching data: " + xhr.responseText);
                }
            });
        });
    </script>
</body>
</html>
