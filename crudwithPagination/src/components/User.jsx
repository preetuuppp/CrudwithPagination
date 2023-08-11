import React, { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Text,
  Input,
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  VStack,
  HStack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { Table, Thead, Tbody, Tr, Th, Td } from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { AiFillDelete } from "react-icons/ai";

function User() {
  const [formData, setFormData] = useState([]);

  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingIndex, setEditingIndex] = useState(-1);
  const [editFormData, setEditFormData] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);

  const toast = useToast();

  // ******************Using Regex for Form Validation***********************
  const validate = (values) => {
    const errors = {};
    const regex = /^[^\$@]*@[^\$@]*\.[^\$@]{2,}$/i;

    if (!values.name) {
      errors.name = "Name is required";
    }

    if (!values.email) {
      errors.email = "Email is required";
    } else if (!regex.test(values.email)) {
      errors.email = "Invalid email format";
    }

    if (!values.mobileNo) {
      errors.mobileNo = "Mobile No. is required";
    } else if (values.mobileNo.length < 10) {
      errors.mobileNo = "Mobile No. must have at least 10 digits";
    }

    if (!values.address) {
      errors.address = "Address is required";
    }

    if (!values.city) {
      errors.city = "City is required";
    }

    if (!values.gender) {
      errors.gender = "Gender is required";
    }

    return errors;
  };

  // ***************Updating the data*********************

  const handleEdit = (index) => {
    setEditFormData(formData[index]);
    setEditingIndex(index);
  };

  // **************Deleting the data*************************

  const handleDelete = (index) => {
    const updatedData = formData.filter((_, i) => i !== index);
    setFormData(updatedData);

    toast({
      title: "Data Deleted",
      description: "Data has been successfully deleted!",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  //*****************Submitting the form********************** */
  const handleSubmit = (e) => {
    e.preventDefault();

    const newEntry = {
      name: e.target.name.value,
      email: e.target.email.value,
      mobileNo: e.target.mobileNo.value,
      address: e.target.address.value,
      city: e.target.city.value,
      gender: e.target.gender.value,
    };

    const errors = validate(newEntry);

    if (Object.keys(errors).length === 0) {
      setFormErrors({});
      setIsSubmit(true);

      if (editingIndex !== -1) {
        // Editing an existing entry
        formData[editingIndex] = newEntry;
        setFormData([...formData]);
        setEditingIndex(-1);
        setEditFormData({});
      } else {
        // Adding a new entry
        setFormData([newEntry, ...formData]);
      }
      toast({
        title: "User Registered",
        description: "User has been successfully registered!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      e.target.reset();
    } else {
      setFormErrors(errors);
    }
  };

  useEffect(() => {
    console.log(formErrors);
    if (Object.keys(formErrors).length === 0 && isSubmit) {
      console.log(formData);
    }
  }, [formErrors]);

  //***************Pagination***************** */

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(parseInt(e.target.value, 10));
  };

  const getPageData = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    return formData.slice(startIndex, endIndex);
  };

  return (
    <ChakraProvider>
      <Box
        p={4}
        m={8}
        maxWidth="350px"
        mx="auto"
        border="1px solid black"
        borderRadius="20px"
        boxShadow="md"
        bgColor="#A076F9"
        color="white"
        fontWeight="bold"
        transition="background-color 0.3s, color 0.3s" // Add a transition effect
        _hover={{
          //  styles when hovering
          bgColor: "purple.600",
        }}
      >
        {Object.keys(formErrors).length === 0 && isSubmit ? (
          <div></div>
        ) : (
          <div></div>
        )}

        <form onSubmit={handleSubmit}>
          <VStack spacing={0}>
            <label htmlFor="">
              Name
              <Input
                name="name"
                defaultValue={editingIndex !== -1 ? editFormData.name : ""}
                placeholder="Name"
                required
              />
            </label>
            <p style={{ color: "red" }}>{formErrors.name}</p>
            <label>
              {" "}
              Email
              <Input
                name="email"
                defaultValue={editingIndex !== -1 ? editFormData.email : ""}
                type="email"
                placeholder="Email"
                required
              />
            </label>
            <p style={{ color: "red" }}>{formErrors.email}</p>

            <label>
              Mobile
              <Input
                name="mobileNo"
                type="tel"
                placeholder="Mobile No"
                defaultValue={editingIndex !== -1 ? editFormData.mobileNo : ""}
                required
              />
            </label>
            <p style={{ color: "red" }}>{formErrors.mobileNo}</p>
            <label>
              Address
              <Input
                name="address"
                placeholder="Address"
                defaultValue={editingIndex !== -1 ? editFormData.address : ""}
                required
              />
            </label>
            <p style={{ color: "red" }}>{formErrors.address}</p>
            <label>
              City
              <Input
                name="city"
                placeholder="City"
                defaultValue={editingIndex !== -1 ? editFormData.city : ""}
                required
              />
            </label>
            <p style={{ color: "red" }}>{formErrors.city}</p>
            <label>
              Gender
              <RadioGroup name="gender">
                <HStack spacing={4}>
                  <Radio value="male">Male</Radio>
                  <Radio value="female">Female</Radio>
                </HStack>
              </RadioGroup>
            </label>
            <Checkbox name="confirm">Confirm</Checkbox>
            <Button type="submit">Submit</Button>
          </VStack>
        </form>
        <Divider my={4} />
      </Box>
      {formData.length > 0 && (
        <>
          <Table
            style={{
              borderCollapse: "collapse",
              width: "100%",
              color: "black",
              margin: "20px auto", // Center the table
              backgroundColor: "#EDE4FF", // Set background color
              borderRadius: "8px", // Rounded corners
              overflow: "hidden", // Hide overflowing content
              boxShadow: "0px 5px 10px rgba(0, 0, 0, 0.3)", // Add a shadow
            }}
          >
            <Thead>
              <Tr>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "15px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Sr No.
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Name
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Email
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Mobile No
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Address
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  City
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Gender
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Edit
                </Th>
                <Th
                  style={{
                    border: "1px solid #ddd",
                    padding: "8px",
                    color: "black",
                    fontSize: "15px",
                  }}
                >
                  Delete
                </Th>
              </Tr>
            </Thead>

            <Tbody>
              {getPageData().map((entry, index) => (
                <Tr key={index}>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {index + 1}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.name}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.email}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.mobileNo}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.address}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.city}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    {entry.gender}
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Button
                      size="sm"
                      colorScheme="teal"
                      onClick={() => handleEdit(index)}
                    >
                      <AiFillEdit />
                    </Button>
                  </Td>
                  <Td style={{ border: "1px solid #ddd", padding: "8px" }}>
                    <Button
                      size="sm"
                      colorScheme="red"
                      onClick={() => handleDelete(index)}
                    >
                      <AiFillDelete />
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Divider my={4} />

          <select
            value={itemsPerPage}
            onChange={handleItemsPerPageChange}
            style={{
              border: "1px solid black",
              padding: "8px",
              color: "black",
              fontSize: "15px",
              alignItems: "center",
              marginTop: "8px",
              margin: "auto",
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={25}>25 per page</option>
            <option value={formData.length}>Show All</option>
          </select>
        </>
      )}
    </ChakraProvider>
  );
}

export default User;
