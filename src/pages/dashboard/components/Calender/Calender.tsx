import { useEffect, useState } from "react";
import "./calender.scss";
import { addClass } from "@syncfusion/ej2-base";

import {
  Inject,
  ScheduleComponent,
  Day,
  Week,
  Month,
  ResourceDirective,
  ResourcesDirective,
  ViewDirective,
  ViewsDirective,
  DragAndDrop,
  Resize,
  TimelineViews,
  TimelineMonth,
} from "@syncfusion/ej2-react-schedule";
import {
  appointmentsCollection,
  appointmentsDocument,
  databaseID,
  databases,
} from "../../../../appwrite/config";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
export default function Calender() {
  useEffect(() => {
    const popup = document.querySelector('[style*="z-index: 999999999;"]');
    const popup2 = document.querySelector('[style*="z-index: 99999;"]');

    // 99999
    if (popup && popup.parentNode) {
      popup.parentNode.removeChild(popup);
      console.log("Element with z-index 999999999 deleted.");
    }

    if (popup2 && popup2.parentNode) {
      popup2.parentNode.removeChild(popup2);
      console.log("Element with z-index 999999999 deleted.");
    }
  }, []);

  const [scheduleData, setScheduleData] = useState([]);

  useEffect(() => {
    databases
      .getDocument(databaseID, appointmentsCollection, appointmentsDocument)
      .then((response) => {
        setScheduleData(JSON.parse(response.appointments));
        console.log(JSON.parse(response.appointments));
      })
      .catch((error) => {
        console.error("Error fetching schedule data:", error);
      });
  }, []);

  useEffect(() => {
    if (scheduleData.length > 0) {
      databases
        .updateDocument(
          databaseID,
          appointmentsCollection,
          appointmentsDocument,
          {
            appointments: JSON.stringify(scheduleData),
          }
        )
        .then((response) => {
          console.log("Schedule data updated successfully:", response);
        })
        .catch((error) => {
          console.error("Error updating schedule data:", error);
        });
    }
  }, [scheduleData]);

  const resourceData: Record<string, any>[] = [
    {
      text: "Will Smith",
      id: 1,
      color: "#ea7a57",
      ResourceId: 1,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Alice",
      id: 2,
      color: "rgb(53, 124, 210)",
      ResourceId: 2,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Robson",
      id: 3,
      color: "#7fa900",
      ResourceId: 3,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Akash",
      id: 4,
      color: "#7fa900",
      ResourceId: 4,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Ram",
      id: 5,
      color: "#ea7a57",
      ResourceId: 5,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "BOB",
      id: 6,
      color: "rgb(53, 124, 210)",
      ResourceId: 6,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "RAVAN",
      id: 7,
      color: "#7fa900",
      ResourceId: 7,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "GAJAN",
      id: 8,
      color: "#7fa900",
      ResourceId: 8,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "VALI",
      id: 9,
      color: "#ea7a57",
      ResourceId: 9,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "SUGREEV",
      id: 10,
      color: "rgb(53, 124, 210)",
      ResourceId: 10,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "BODHI",
      id: 11,
      color: "#7fa900",
      ResourceId: 11,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "RoJKn",
      id: 12,
      color: "#7fa900",
      ResourceId: 12,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Winjmkl Smith",
      id: 13,
      color: "#ea7a57",
      ResourceId: 13,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Alicn m",
      id: 14,
      color: "rgb(53, 124, 210)",
      ResourceId: 14,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Robsofjkn",
      id: 15,
      color: "#7fa900",
      ResourceId: 15,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
    {
      text: "Robsodjkld;lkjhbn",
      id: 16,
      color: "#7fa900",
      ResourceId: 16,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    },
  ];

  const groupData = {
    resources: ["Doctors"],
    enableCompactView: false,
    allowGroupEdit: true,
  };

  const onRenderCell = (args: any): void => {
    const groupIndex = parseInt(
      args.element.getAttribute("data-group-index"),
      10
    );
    if (!isNaN(groupIndex)) {
      if (
        args.element.classList.contains("e-work-hours") ||
        args.element.classList.contains("e-work-cells")
      ) {
        const classes = ["one", "two"];
        const classIndex = groupIndex % 2; // Alternating between 0 and 1
        addClass([args.element], [classes[classIndex]]);
      }
    }
  };
const services = [0, 1, 0, 0]
  return (
    <div className={"calenderWindow"}>
      <div className="card">
        <div className="headline">
          <h2 className="title">Enter Employee Details</h2>
          <div className="form">
            <input
              className="serviceInput"
              type="text"
              placeholder="Enter Employee Name"
              // value={serviceForm.serviceName}
              // onChange={(e) =>
              //   setServiceForm({ ...serviceForm, serviceName: e.target.value })
              // }
            />
            <input
              className="priceInput"
              type="number"
              placeholder="Job Role"
              // value={serviceForm.price}
              // onChange={(e) =>
              //   setServiceForm({ ...serviceForm, price: e.target.value })
              // }
            />
            <button 
            // onClick={handleAction} disabled={loading}
            >
              {/* {loading
                ? selectedItemId
                  ? "Editing..."
                  : "Adding..."
                : selectedItemId
                ? "EDIT"
                : "ADD"} */}
                ADD
            </button>
          </div>
        </div>

        <div className="rows">
          {services.map((item: any, index: number) => (
            <div className="row" key={index}>
              <p className="title">
                {item.serviceName} - {item.price} ₹
              </p>
              <div className="options">
                <span 
                // onClick={() => editItem(item.$id)}
                >
                  <FaEdit />
                </span>
                <span 
                // onClick={() => deleteItem(item.$id)}
                >
                  <MdDelete />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="calender">
        <ScheduleComponent
          renderCell={onRenderCell}
          eventSettings={{ dataSource: scheduleData }}
          height={"100%"}
          selectedDate={new Date(2024, 2, 20, 10, 30, 0)}
          cssClass="schedule-cell-dimension"
          className="scheduler"
          group={groupData}
          dataBinding={(args) => {
            console.log(args.result);
            setScheduleData(args.result);
          }}
        >
          <ResourcesDirective>
            <ResourceDirective
              field="DoctorId"
              title="Doctor Name"
              name="Doctors"
              dataSource={resourceData}
              textField="text"
              idField="id"
              groupIDField="groupId"
              colorField="color"
              workDaysField="workDays"
              startHourField="startHour"
              endHourField="endHour"
            />
          </ResourcesDirective>
          <ViewsDirective>
            <ViewDirective option="Week" />

            <ViewDirective option="Day" />

            <ViewDirective option="TimelineDay" />
            <ViewDirective option="TimelineMonth" />
          </ViewsDirective>
          <Inject
            services={[
              Day,
              TimelineViews,
              Month,
              TimelineMonth,
              Week,
              Resize,

              DragAndDrop,
            ]}
          />
        </ScheduleComponent>
      </div>
    </div>
  );
}
