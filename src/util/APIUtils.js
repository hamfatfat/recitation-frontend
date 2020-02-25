import { API_BASE_URL, ACCESS_TOKEN } from "../constants";
const request = (options, type = "json") => {
  let headers = new Headers();
  if (type === "json") {
    headers = new Headers({
      "Content-Type":
        type === "json" ? "application/json" : "application/form-data"
    });
  }

  if (localStorage.getItem(ACCESS_TOKEN)) {
    headers.append(  "Authorization",
      "Bearer " + localStorage.getItem(ACCESS_TOKEN)
    );
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then(response =>
    response.json().then(json => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getCurrentUser() {
  if (!localStorage.getItem(ACCESS_TOKEN)) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/auth/user",
    method: "GET"
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest)
  });
}

export function saveUser(userRequest) {
  return request({
    url: API_BASE_URL + "/users",
    method: "POST",
    body: JSON.stringify(userRequest)
  });
}
export function updateUser(userRequest) {
  return request({
    url: API_BASE_URL + "/users/"+userRequest.id,
    method: "PUT",
    body: JSON.stringify(userRequest)
  });
}
export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}


export function fetchAllUsers() {
  return request({
    url: API_BASE_URL + "/users",
    method: "GET"
  });
}

export function fetchAllTeacherByCenter($centerId){
  return request({
    url: API_BASE_URL+"/teachers/findTeacherByCenterId/"+$centerId,
    method: "GET"
  })
}
export function fetchAllTeachers(){
  return request({
    url: API_BASE_URL+"/teachers/findAllTeachers",
    method: "GET"
  })
}


export function deleteUser(id) {
  return request({
    url: API_BASE_URL + "/users/"+parseInt(id),
    method: "DELETE"
  });
}

export function saveNewStep(stepRequest) {
  return request({
    url: API_BASE_URL + ("/step"+(stepRequest.id !== undefined?"/"+stepRequest.id:"")),
    method: stepRequest.id === undefined?"POST":"PUT",
    body: JSON.stringify(stepRequest)
  });
}
export function stepsFetchAll(recitationTemplateId) {
  return request({
    url: API_BASE_URL + "/step/findByTemplateId/"+recitationTemplateId,
    method: "GET"
  });
}
export function stepsById(stepId) {
  return request({
    url: API_BASE_URL + "/step/"+stepId,
    method: "GET"
  });
}

export function deleteStep(stepId) {
  return request({
    url: API_BASE_URL + "/step/"+stepId,
    method: "DELETE"
  });
}


export function saveNewRecitationTemplate(recitationTemplateRequest) {
  return request({
    url: API_BASE_URL + ("/recitationtemplate"+(recitationTemplateRequest.id !== undefined?"/"+recitationTemplateRequest.id:"")),
    method: recitationTemplateRequest.id === undefined?"POST":"PUT",
    body: JSON.stringify(recitationTemplateRequest)
  });
}
export function recitationTemplatesFetchAll() {
  return request({
    url: API_BASE_URL + "/recitationtemplate",
    method: "GET"
  });
}
export function recitationTemplatesById(recitationTemplateId) {
  return request({
    url: API_BASE_URL + "/recitationtemplate/"+recitationTemplateId,
    method: "GET"
  });
}
export function deleteRecitationTemplatesById(recitationTemplateId) {
  return request({
    url: API_BASE_URL + "/recitationtemplate/"+recitationTemplateId,
    method: "DELETE"
  });
}


export function saveNewRecitationCenter(recitationCenterRequest) {
  return request({
    url: API_BASE_URL + ("/center"+(recitationCenterRequest.id !== undefined?"/"+recitationCenterRequest.id:"")),
    method: recitationCenterRequest.id === undefined?"POST":"PUT",
    body: JSON.stringify(recitationCenterRequest)
  });
}
export function recitationCentersFetchAll() {
  return request({
    url: API_BASE_URL + "/center",
    method: "GET"
  });
}
export function recitationCentersById(recitationCenterId) {
  return request({
    url: API_BASE_URL + "/center/"+recitationCenterId,
    method: "GET"
  });
}

export function deleteRecitationCentersById(recitationCenterId) {
  return request({
    url: API_BASE_URL + "/center/"+recitationCenterId,
    method: "DELETE"
  });
}

export function getAllRevisions() {
  return request({
    url: API_BASE_URL + "/revisionstep",
    method: "GET"
  });
}
export function saveRevision(revisionRequest) {
  return request({
    url: API_BASE_URL + "/revisionstep",
    method: "POST",
    body: JSON.stringify(revisionRequest)
  });
}
export function updateRevision(revisionRequest) {
  return request({
    url: API_BASE_URL + "/revisionstep/"+revisionRequest.id,
    method: "PUT",
    body: JSON.stringify(revisionRequest)
  });
}
export function deleteRevision(id) {
  return request({
    url: API_BASE_URL + "/revisionstep/"+parseInt(id),
    method: "DELETE"
  });
}


export function getAllSchedules() {
  return request({
    url: API_BASE_URL + "/schedule",
    method: "GET"
  });
}
export function saveSchedule(scheduleRequest) {
  return request({
    url: API_BASE_URL + "/schedule",
    method: "POST",
    body: JSON.stringify(scheduleRequest)
  });
}
export function updateSchedule(scheduleRequest) {
  return request({
    url: API_BASE_URL + "/schedule",
    method: "PUT",
    body: JSON.stringify(scheduleRequest)
  });
}
export function deleteSchedule(id) {
  return request({
    url: API_BASE_URL + "/schedule/"+parseInt(id),
    method: "DELETE"
  });
}



export function getRecitationsByRevId(revId) {
  return request({
    url: API_BASE_URL + "/recitationstep/byrevId/"+revId,
    method: "GET"
  });
}
export function saveRecitation(recitationRequest) {
  return request({
    url: API_BASE_URL + "/recitationstep",
    method: "POST",
    body: JSON.stringify(recitationRequest)
  });
}
export function updateRecitation(recitationRequest, id) {
  return request({
    url: API_BASE_URL + "/recitationstep/"+id,
    method: "PUT",
    body: JSON.stringify(recitationRequest)
  });
}
export function deleteRecitation(id) {
  return request({
    url: API_BASE_URL + "/recitationstep/"+parseInt(id),
    method: "DELETE"
  });
}

export function stageClassesStructure(schoolId) {
  return request({
    url: API_BASE_URL + "/schoolStages/" + schoolId,
    method: "GET"
  });
}
export function coursesStructure() {
  return request({
    url: API_BASE_URL + "/course",
    method: "GET"
  });
}
export function coursesByStudentStructure(studentId) {
  return request({
    url: API_BASE_URL + "/courseByStudent/"+studentId,
    method: "GET"
  });
}
export function courseWhiteboardsByStudentStructure(courseId,page,docId,type) {
  return request({
    url: API_BASE_URL + "/courseWhiteboard/"+courseId+"/"+page+"/"+docId+"/"+type,
    method: "GET"
  });
}
export function saveCourses(signupRequest) {
  return request({
    url: API_BASE_URL + "/saveCourses",
    method: "POST",
    body: JSON.stringify(signupRequest)
  });
}
export function saveCourseWhiteboard(whiteboardRequest) {
  return request({
    url: API_BASE_URL + "/courseWhiteboard",
    method: "POST",
    body: JSON.stringify(whiteboardRequest)
  });
}
export function uploadFile(reqeust) {
  const formData = new FormData();
  formData.append("file", reqeust.file);
  formData.append("courseId", reqeust.courseId);
  formData.append("classId", reqeust.classId);
  formData.append("schoolId", reqeust.schoolId);
  return request(
    {
      url: API_BASE_URL + "/uploadFile",
      method: "POST",
      body: formData
    },
    "pdf"
  );
}
