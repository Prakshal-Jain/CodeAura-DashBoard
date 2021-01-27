// Enter JSON filename as json_url
json_url = "../../../hackathons.json"

// Data Structure:
// [{event-name: ______, event-logo: ______, event-start-date: ______, event-end-date: ______, ribbon yellow: ______, event-location: ______, event-link:  ______}]
// data is parsed and stored in "data" variable
function get_data(){
    var parsed_json = [];
    $.ajax({
        'async': false,
        'global': false,
        'url': json_url,
        'dataType': "json",
        'success': function (json_data) {
            parsed_json = json_data;
        }
    });
    return parsed_json;
}

var filtered = get_data();

var headings = ["event-name", "event-link", "event-logo", "event-start-date", "event-end-date", "event-mode", "event-location"]

// Needs to be changed --> According to the homepage
function populateTable(data){
    document.getElementById("event").innerHTML = "";
    for(let d of data){
        document.getElementById("event").innerHTML += '\
        <tr>\
            <td class="border-0">\
                <a href="'+d["event-link"]+'" class="d-flex align-items-center" target="_blank">\
                    <img class="mr-2 image image-small rounded-circle" alt="Image placeholder" src="'+d["event-logo"]+'\
                    <div><span class="h6">'+d["event-name"]+'</span></div>\
                </a>\
            </td>\
            <td class="border-0 font-weight-bold">'+d["event-start-date"]+'</td>\
            <td class="border-0 font-weight-bold">'+d["event-end-date"]+'</td>\
            <td class="border-0 font-weight-bold">'+d["event-mode"]+'</td>\
            <td class="border-0 font-weight-bold">'+d["event-location"]+'</td>\
            </tr>\
        ';
    }
    document.getElementById("result_count").innerHTML = data.length+" results found";
}

// By default the table is sorted according to date of the event
function find_date_range(start, end){
    // This function retrieves all the entries within specified date range
    var start_date = Date.parse(start);
    var end_date = Date.parse(end);
    var dates_in_range = [];
    if(end != ""){
        for(let d of filtered){
            if(Date.parse(d["event-start-date"]) >= start_date && Date.parse(d["event-end-date"]) <= end_date){
                dates_in_range.push(d);
            }
        }
    }
    else{
        for(let d of filtered){
            if(Date.parse(d["event-start-date"]) >= start_date){
                dates_in_range.push(d);
            }
        }
    }
    dates_in_range
    populateTable(dates_in_range);
}

function find_location(){
    document.getElementById("warn").innerHTML = "";
    var location = String(document.getElementById("get_location").value).toLowerCase();
    if(location == ""){
        document.getElementById("warn").innerHTML = "";
    }
    else{
        // Retrieves all entries whose event-location matches the string "location"
        var events_at_location = []
        for(let d of filtered){
            if(d["event-location"].toLowerCase().includes(location)){
                events_at_location.push(d);
            }
        }
        populateTable(events_at_location)
    }
}

function find_name(){
    document.getElementById("warn").innerHTML = "";
    var name = String(document.getElementById("get_name").value).toLowerCase();
    if(name == ""){
        document.getElementById("warn").innerHTML = "";
    }
    else{
        // Retrieves all entries whose event-location matches the string "location"
        var events_at_name = []
        for(let d of filtered){
            if(d["event-name"].toLowerCase().includes(name)){
                events_at_name.push(d);
            }
        }
        populateTable(events_at_name)
    }
}

// Another function to get list of all hackathons withing a circular region --> Maps API
let filters = ["select_date", "select_location", "select_name"]
// Reset all filters
function reset_all(){
    for(let option of filters){
        document.getElementById(option).style.display = "none";
    }
    populateTable(filtered)
}

// Add date input to template
function add_option(id){
    for(let option of filters){
        if(option == id){
            document.getElementById(id).style.display = "block";
        }
        else{
            document.getElementById(option).style.display = "none";
        }
    }
}

function getDateRange(){
    document.getElementById("warn").innerHTML = "";
    start = document.getElementById("start").value;
    end = document.getElementById("end").value;
    var should_call = true
    if(start != ""){
        splits = String(start).split("/");
        start = splits[2]+"-"+splits[0]+"-"+splits[1];
    }
    else{
        should_call = false
        document.getElementById("warn").innerHTML = "Please enter a start date.";
    }
    if(end != ""){
        splits = String(end).split("/")
        end = splits[2]+"-"+splits[0]+"-"+splits[1];
    }
    if(should_call){
        document.getElementById("warn").innerHTML = "";
        find_date_range(String(start), String(end));
    }
    document.getElementById("start").value = "";
    document.getElementById("end").value = "";
}

// To reset the fields, call get_data()
populateTable(filtered)