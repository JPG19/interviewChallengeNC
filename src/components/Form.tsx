import React from "react";

interface MembersProps {
  firstName?: string;
  lastName?: string;
  address?: string;
  ssn?: string;
}

const token =
  "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjEsIm5hbWUiOiJzYXJhaCIsImFkbWluIjpmYWxzZSwiaWF0IjoxNjUyMDI3Mjk2LCJleHAiOjE2NTIwMzA1OTZ9.OSJ3ckYY65Te7mX8_fzWvR_zrkpP1aaeT5wukiXWjfA";

const Form = () => {
  const [members, setMembers] = React.useState<MembersProps[]>([]);
  const [error, setError] = React.useState<string>("");
  const [disabled, setDisabled] = React.useState<boolean>(true);

  const resetForm = () => {
    (document.getElementById("fname") as HTMLInputElement).value = "";
    (document.getElementById("lname") as HTMLInputElement).value = "";
    (document.getElementById("address") as HTMLInputElement).value = "";
    (document.getElementById("ssn") as HTMLInputElement).value = "";
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    setDisabled(true);

    const formData = new FormData(e.target);
    const formProps = Object.fromEntries(formData);

    // check if the SSN number already exists (already covered by api)
    // const duplicateSSNMember = members.find((m) => m.ssn === formProps.ssn);

    let data = new FormData();
    data.append("firstName", (formProps.fname as string).trim());
    data.append("lastName", (formProps.lname as string).trim());
    data.append("address", (formProps.address as string).trim());
    data.append("ssn", (formProps.ssn as string).trim());

    const errorTime = 5 * 1000;

    fetch("http://localhost:8081/api/members", {
      method: "POST",
      headers: {
        Authorization: token,
      },
      body: data,
    })
      .then((res) => res.json())
      .then((result) => {
        if (result.code === "BadRequest") {
          return Promise.reject(result);
        }

        const addedMember: MembersProps = {
          firstName: result.firstName,
          lastName: result.lastName,
          address: result.address,
          ssn: result.ssn,
        };
        const newMembers = [...members, addedMember];

        resetForm();
        setMembers(newMembers);
        setTimeout(() => {
          setDisabled(true);
        }, errorTime);
      })
      .catch((err) => {
        setError(err?.message || "Error trying to submit, please try again");
        setTimeout(() => {
          setDisabled(false);
          setError("");
        }, errorTime);
      });
  };

  React.useEffect(() => {
    const getMembers = () => {
      fetch("http://localhost:8081/api/members", {
        method: "GET",
        headers: {
          Authorization: token,
        },
      })
        .then((res) => res.json())
        .then((result) => {
          if (result.code === "Unauthorized") {
            return Promise.reject(result);
          }
          setMembers(result);
          setError("");
        })
        .catch((err) => {
          console.log("err: ", err);
          setError("An error ocurred when getting the members list");
        });
    };

    getMembers();
    let interval: any;

    let inactivityTime = function () {
      window.onload = resetInterval;
      document.onmousemove = resetInterval;
      document.onkeydown = resetInterval;

      function resetInterval() {
        clearInterval(interval);
        interval = setInterval(getMembers, 120 * 1000);
      }

      return () => {
        document.removeEventListener("keydown", resetInterval);
        document.removeEventListener("onload", resetInterval, false);
        document.removeEventListener("click", resetInterval, false);
      };
    };

    inactivityTime();
  }, []);

  const onInputChange = () => {
    // checks for valid input data
    const formData = new FormData(
      document.getElementById("form") as HTMLFormElement
    );
    const formProps = Object.fromEntries(formData);

    const firstName: string = formProps.fname as string;
    const lastName: string = formProps.lname as string;
    const address: string = formProps.address as string;
    const ssn: string = formProps.ssn as string;

    let firstNamePass = firstName.trim().length > 1;
    let lastNamePass = lastName.trim().length > 1;
    let addressPass = address.trim().length > 1;
    let ssnPass = ssn.trim().match(/^[0-9]{3}\-?[0-9]{2}\-?[0-9]{4}$/);

    if (firstNamePass && lastNamePass && addressPass && ssnPass) {
      setDisabled(false);
      return;
    }
    setDisabled(true);
  };

  return (
    <div className="form-container">
      <div className="flex-container">
        <form onSubmit={(e) => onSubmit(e)} id="form">
          <input
            type="text"
            id="fname"
            name="fname"
            placeholder="First Name"
            onChange={() => onInputChange()}
          />
          <input
            type="text"
            id="lname"
            name="lname"
            placeholder="Last Name"
            onChange={() => onInputChange()}
          />
          <input
            type="text"
            id="address"
            name="address"
            placeholder="Address"
            onChange={() => onInputChange()}
          />
          <input
            type="text"
            id="ssn"
            name="ssn"
            placeholder="SSN - ###-##-####"
            onChange={() => onInputChange()}
          />

          <div className="buttons">
            <button type="button" onClick={() => resetForm()}>
              Reset
            </button>
            <button
              type="submit"
              id="submit-button"
              className={`${disabled ? "disabled" : ""}`}
              disabled={disabled}
            >
              Save
            </button>
          </div>
          {error && <div className="error">{error}</div>}
        </form>

        {/* not using table because i'm having issues making it work with overflow */}
        <div className="table">
          <div className="header">
            <div>First Name</div>
            <div>Last Name</div>
            <div>Address</div>
            <div>SSN</div>
          </div>

          <div className="grid-container">
            {members.length > 0 &&
              members.map((member) => (
                <React.Fragment key={member.ssn}>
                  <div>{member.firstName}</div>
                  <div>{member.lastName}</div>
                  <div>{member.address}</div>
                  <div>{member.ssn}</div>
                </React.Fragment>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
