import { Paper, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { Button, Col, Form, Row, Spinner } from "react-bootstrap";
import * as yup from "yup";
import Swal from "sweetalert2";
import "./todo.css";

export const Todo = () => {
  const [todoList, setTodoList] = useState<any>();
  const [functionCalled, setFunctionCalled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [addLoading, setAddLoading] = useState(false);

  const validationSchema = yup.object().shape({
    title: yup.string().required("*Enter Task Name"),
  });

  const handleEdit = async (refId: string) => {
    const result: any = await Swal.mixin({
      input: "text",
      confirmButtonText: "Update",
      showCancelButton: true,
    }).queue([
      {
        titleText: "Enter Task",
        input: "text",
      },
    ]);
    if (result.value) {
      const { value } = result;
      console.log(value);
      setLoading(true);
      fetch("/.netlify/functions/updateTodo", {
        method: "POST",
        body: JSON.stringify({
          id: refId,
          title: value[0],
        }),
      }).then((result) => {
        result.json().then((data) => {
          console.log(data);
          setFunctionCalled(!functionCalled);
        });
      });
    }
  };

  const handleDelete = (refId: string) => {
    setLoading(true);
    fetch("/.netlify/functions/deleteTodo", {
      method: "POST",
      body: JSON.stringify({
        id: refId,
      }),
    }).then((result) => {
      console.log(result);
      setFunctionCalled(!functionCalled);
    });
  };

  useEffect(() => {
    setLoading(true);
    fetch("/.netlify/functions/getAllTodos").then((result) => {
      result.json().then((data) => {
        setTodoList(data);
        setLoading(false);
      });
    });
  }, [functionCalled]);
  return (
    <>
      <Formik
        initialValues={{ title: "" }}
        validationSchema={validationSchema}
        onSubmit={(values, { resetForm }) => {
          // console.log(values);
          resetForm({
            values: { title: "" },
          });
          setAddLoading(true);
          fetch("/.netlify/functions/addTodo", {
            method: "POST",
            body: JSON.stringify(values),
          }).then((result) => {
            result.json().then((task) => {
              setFunctionCalled(!functionCalled);
              console.log(task);
              setAddLoading(false);
            });
          });
        }}
      >
        {({ values, handleSubmit, touched, errors, handleChange }) => (
          <Form onSubmit={handleSubmit}>
            <Row style={{ marginTop: "40px" }}>
              <Col style={{ display: "flex", justifyContent: "center" }}>
                <Form.Control
                  name="title"
                  placeholder="Enter Task"
                  value={values.title}
                  type="text"
                  onChange={handleChange}
                  isInvalid={touched.title && errors.title ? true : false}
                  isValid={touched.title && !errors.title ? true : false}
                  className="input-field"
                />
                {addLoading ? (
                  <Button
                    variant="secondary"
                    disabled
                    style={{ marginLeft: "10px" }}
                  >
                    Adding...
                  </Button>
                ) : (
                  <Button
                    variant="dark"
                    type="submit"
                    style={{ marginLeft: "10px" }}
                  >
                    Add Task
                  </Button>
                )}
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
      <br />
      <br />
      {loading ? (
        <Spinner animation="border" variant="secondary" />
      ) : (
        <div className="todo-list-container">
          {console.log(todoList)}
          {todoList !== undefined &&
            todoList.data.map((task: any, ind: number) => {
              return (
                <div
                  style={{
                    width: "50%",
                    margin: "0 auto",
                    marginBottom: "5px",
                  }}
                  key={ind}
                >
                  <Paper
                    elevation={3}
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      padding: "5px",
                    }}
                    className="task"
                  >
                    <span style={{ margin: "auto 0" }}>
                      <Typography
                        variant="subtitle2"
                        style={{
                          fontSize: "20px",
                          fontWeight: "bold",
                          color: "grey",
                        }}
                      >
                        {task.data?.title}
                      </Typography>
                    </span>
                    <span style={{ margin: "auto 0", marginLeft: "auto" }}>
                      <span>
                        <Button
                          variant="link"
                          onClick={() => {
                            handleEdit(task.ref["@ref"].id);
                          }}
                        >
                          <EditIcon htmlColor="grey" />
                        </Button>
                      </span>
                      <span>
                        <Button
                          variant="link"
                          onClick={() => {
                            handleDelete(task.ref["@ref"].id);
                          }}
                        >
                          <DeleteIcon htmlColor="grey" />
                        </Button>
                      </span>
                    </span>
                  </Paper>
                </div>
              );
            })}
        </div>
      )}
    </>
  );
};
