import React, { useEffect, useState } from "react";
import { useInvoiceListData } from "../redux/hooks";
import { Button, Card, Col, Row, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { bulkUpdate } from "../redux/invoicesSlice";
import { useLocation, useNavigate } from "react-router-dom";

const BulkEdit = () => {
  const { invoiceList } = useInvoiceListData();
  const navigate = useNavigate();
  const [editedList, setEditedList] = useState([]);
  const location = useLocation();
  const selectedInvoiceList = invoiceList.filter((invoice) =>
    location.state.idList.includes(invoice.id)
  );

  const dispatch = useDispatch();

  const validateData = (data) => {
    if (
      !data.billFrom[0] ||
      !data.billFromEmail[0] ||
      !data.billFromAddress[0]
    ) {
      alert("Please fill in all Bill From fields");
      return false;
    }

    if (!data.billTo[0] || !data.billToEmail[0] || !data.billToAddress[0]) {
      alert("Please fill in all Bill To fields");
      return false;
    }

    // if(!data.billFromEmail[0].includes("@")){
    //   alert("Invalid Bill From email")
    //   return false
    // }
    // if(!data.billToEmail[0].includes("@")){
    //   alert("Invalid Bill To email")
    //   return false
    // }

    if (data.discountRate > 100 || data.discountRate < 0) {
      alert("Discount rate should be in range 0 to 100 ");
      return false;
    }

    if (data.taxRate > 100 || data.taxRate < 0) {
      alert("Tax rate should be in range 0 to 100 ");
      return false;
    }

    const dateValue = new Date(data.dateOfIssue);

    if (dateValue < new Date()) {
      alert(`Due date should not be in the past ${data.dateOfIssue} `);
      return false;
    }

    return true;
  };

  return (
    
    <Row>
      <Col className="mx-auto">
        <h3 className="fw-bold pb-2 pb-md-4 text-center">BULK EDIT</h3>
        <Card className="d-flex p-3 p-md-4 my-3 my-md-4 ">
          <Table responsive>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Invoice No</th>
                <th>ID</th>
                <th>Bill to</th>
                <th>Bill to Email</th>
                <th>Bill To Address</th>
                <th>Bill from </th>
                <th>Bill from Email</th>
                <th>Bill from Address</th>
                <th>Currency</th>
                <th>Due Date</th>
                <th>SubTotal</th>
                <th>Total</th>
                <th>Discount Rate</th>
                <th>Discount Amount</th>
                <th>TaxRate</th>
                <th>TaxAmount</th>
                <th>Items</th>
              </tr>
            </thead>
            <tbody>
              {selectedInvoiceList.length === 0 ? (
                <tr>
                  <td colSpan={"16"} className="text-center fw-bold py-5 fs-2">
                    Select data to edit
                  </td>
                </tr>
              ) : (
                selectedInvoiceList.map((invoice) => (
                  <EditRow
                    key={invoice.id}
                    invoice={invoice}
                    editList={editedList}
                    addtoEditList={setEditedList}
                  />
                ))
              )}
            </tbody>
          </Table>
          <Button
            disabled={selectedInvoiceList.length === 0 ? true : false}
            onClick={() => {
              if (editedList.every((invoice) => validateData(invoice))) {
                dispatch(bulkUpdate(editedList));
                alert("CHANGES SAVED");
                navigate("/");
              }
            }}
          >
            SAVE CHANGES
          </Button>
        </Card>
      </Col>
    </Row>
  );
};

const EditRow = ({ invoice, editList, setEditedList }) => {
  const [invoiceDetail, setInvoiceDeatil] = useState(invoice);

  const handleEdit = (e) => {
    console.log(e.target.name);
    setInvoiceDeatil({ ...invoiceDetail, [e.target.name]: [e.target.value] });
    if (e.target.name == "taxRate" || e.target.name == "discountRate") {
      console.log("running calc");
      handleCalculateTotal();
    }
  };

  useEffect(() => {
    const index = editList.findIndex(
      (invoice) => invoice.id === invoiceDetail.id
    );
    if (index !== -1) {
      editList[index] = invoiceDetail;
    } else {
      editList.push(invoiceDetail);
    }
  }, [invoiceDetail]);

  console.log(invoiceDetail);

  const handleCalculateTotal = () => {
    setInvoiceDeatil((prevFormData) => {
      let subTotal = 0;

      prevFormData.items.forEach((item) => {
        subTotal +=
          parseFloat(item.itemPrice).toFixed(2) * parseInt(item.itemQuantity);
      });

      const taxAmount = parseFloat(
        subTotal * (prevFormData.taxRate / 100)
      ).toFixed(2);
      const discountAmount = parseFloat(
        subTotal * (prevFormData.discountRate / 100)
      ).toFixed(2);
      const total = (
        subTotal -
        parseFloat(discountAmount) +
        parseFloat(taxAmount)
      ).toFixed(2);

      return {
        ...prevFormData,
        subTotal: parseFloat(subTotal).toFixed(2),
        taxAmount,
        discountAmount,
        total,
      };
    });
  };

  const handleItemEdit = (key, index, value) => {
    let obj = JSON.parse(JSON.stringify(invoiceDetail));
    // console.log("check it",obj)

    obj.items[index][key] = value;
    // console.log("check it2",obj)
    setInvoiceDeatil(obj);
    if (key === "itemPrice" || key === "itemQuantity") {
      handleCalculateTotal();
    }
  };

  return (
    <tr>
      <td>{invoiceDetail.invoiceNumber}</td>
      <td>{invoiceDetail.id}</td>
      <td>
        <input
          value={invoiceDetail.billTo}
          type="text"
          required
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billTo"
        />
      </td>
      <td>
        <input
          value={invoiceDetail.billToEmail}
          type="email"
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billToEmail"
        />
      </td>
      <td>
        <input
          type="text"
          value={invoiceDetail.billToAddress}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billToAddress"
        />
      </td>
      <td>
        <input
          type="text"
          value={invoiceDetail.billFrom}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billFrom"
        />
      </td>
      <td>
        <input
          type="email"
          value={invoiceDetail.billFromEmail}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billFromEmail"
        />
      </td>
      <td>
        <input
          type="text"
          value={invoiceDetail.billFromAddress}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="billFromAddress"
        />
      </td>
      <td>
        <select
          style={{ width: "10rem" }}
          value={invoiceDetail.currency}
          name="currency"
          onChange={(event) => {
            handleEdit(event);
          }}
        >
          <option value="$">USD (United States Dollar)</option>
          <option value="£">GBP (British Pound Sterling)</option>
          <option value="¥">JPY (Japanese Yen)</option>
          <option value="$">CAD (Canadian Dollar)</option>
          <option value="$">AUD (Australian Dollar)</option>
          <option value="$">SGD (Singapore Dollar)</option>
          <option value="¥">CNY (Chinese Renminbi)</option>
          <option value="₿">BTC (Bitcoin)</option>
        </select>
      </td>
      <td>
        <input
          type="date"
          value={invoiceDetail.dateOfIssue}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="dateOfIssue"
        />
      </td>
      <td>
        <span>{invoiceDetail.currency + invoiceDetail.subTotal}</span>
      </td>
      <td>
        <span>{invoiceDetail.currency + invoiceDetail.total}</span>
      </td>
      <td>
        <input
          type="number"
          placeholder="0.0"
          min="0.00"
          step="0.01"
          max="100.00"
          value={invoiceDetail.discountRate}
          onChange={(e) => {
            handleEdit(e);
          }}
          name="discountRate"
        />
      </td>
      <td>
        <span>{invoiceDetail.discountAmount}</span>
      </td>
      <td>
        <input
          value={invoiceDetail.taxRate}
          type="number"
          placeholder="0.0"
          min="0.00"
          step="0.01"
          max="100.00"
          onChange={(e) => {
            handleEdit(e);
          }}
          name="taxRate"
        />
      </td>
      <td>
        <span>{invoiceDetail.taxAmount}</span>
      </td>
      <td>
        {invoiceDetail.items.map((item, index) => {
          return (
            <div className="d-flex">
              <div className="d-flex align-items-center">
              <span>ItemName</span>
              <input
                type="text"
                className="mx-1 w-1"
                value={item.itemName}
                onChange={(e) =>
                  handleItemEdit("itemName", index, e.target.value)
                }
              />
              </div>
              <div className="d-flex align-items-center">
                <span>Price</span>
              <input
                type="number"
                placeholder="0.0"
                min="0.00"
                step="0.01"
                max="100.00"
                className="m-1 text-center"
                value={item.itemPrice}
                onChange={(e) =>
                  handleItemEdit("itemPrice", index, e.target.value)
                }
              />
              </div>
              <div className="d-flex align-items-center">
                <span>Quantity</span>
              <input
                type="number"
                placeholder="0.0"
                min="0.00"
                step=""
                max="100.00"
                className="m-1 text-center"
                value={item.itemQuantity}
                onChange={(e) =>
                  handleItemEdit("itemQuantity", index, e.target.value)
                }
              />
              </div>
            </div>
          );
        })}
      </td>
    </tr>
  );
};

export default BulkEdit;
