document.addEventListener("DOMContentLoaded", () => {
  const addPerson = document.getElementById("addPerson");
  const getPerson = document.getElementById("getPerson");
  const listPeople = document.getElementById("listPeople");
  const name = document.getElementById("name");
  const age = document.getElementById("age");
  const index = document.getElementById("index");
  const result = document.getElementById("result");

  addPerson.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/v1/people", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: name.value, age: Number(age.value)}),
      });
      const data = await response.json();
      if (response.status === 200){
      }
      result.textContent = JSON.stringify(data);
    } catch (err) {
      // console.log(err)
      result.textContent = err.message;
    }
  });
  listPeople.addEventListener("click", async (event) => {
    event.preventDefault();
    try {
      const response = await fetch("/api/v1/people", {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);
    } catch (err) {
      result.textContent = err.message;
    }
  });
  getPerson.addEventListener("click", async (event) => {
    event.preventDefault();
    const index1 = encodeURIComponent(index.value);
    if(index1 === '' ){
      // console.log(`${index1}`);
      result.textContent =` You cannot press the SHOW PERSON button without an index, or with an index = 0`;
    }
    else{
    try {
      const response = await fetch(`/api/v1/people/${index1}`, {
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      result.textContent = JSON.stringify(data);
    } catch (err) {
      result.textContent = err.message;
    }
  }});
});
