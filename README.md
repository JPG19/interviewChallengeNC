# NC Challenge

![image](https://user-images.githubusercontent.com/47921985/167306619-2bc74777-899e-4aff-9687-08b547ffddb8.png)

As you can see from the image above this is how the site looks, there's both a form and a table. As you might expect, the form is the one in charge of submitting member data, send it to an api and store it and the table is the one displaying that data. When loading the site, the api is being called to retrieve all the stored members and the table displays them. Header and footer do not provide anything to the site other than looks.

The form has 4 fields which are
 - First Name
 - Last Name
 - Address
 - SSN (Social security number)

These 4 fields combined make up a member that is to be sent to the api via the save button. The reset button is there to clear all the populated data in each form field.

However, the save button is disabled by default and to enable it, there are conditions to be met before being able to hit the save button and create a new member, these are the following:

 - First Name, Last Name and Address field data has to be longer than a character
 - SSN field has to be in the following format "###-##-####"

When these conditions are met, then the save button is enabled and on clicked, the form data is sent to the api to be stored and a new member is displaying on the table. Errors are displayed below the reset and save button.

Assuming the back end server is up and all the endpoints are ready to be hit then we can test the site.
To start off this site, clone the repository and run "npm install" once the site starts you will need to create a new token in order to be authenticated, hit 
http://localhost:8081/auth
to get the token as a response, i personally use Postman to do this. Once you've obtained the token then replace the token value with the new one on src/Form.tsx line 10 (Always keep "Bearer" as the prefix). Once this is setup then you should be able to get the list of members from this endpoint via a GET request http://localhost:8081/api/members 
You should also be able to save values from the form into the table.
