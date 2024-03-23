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
  employeesCollection,
} from "../../../../appwrite/config";
import { FaEdit } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useDataContext } from "../../../../context api/DataContext";
import { v4 as uuidv4 } from "uuid";

export default function Calender() {
  const [scheduleData, setScheduleData] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [jobRole, setJobRole] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const { employees, reFetch } = useDataContext();

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

  const resourceData: Record<string, any>[] = employees.map((item: any, index: number) => {
    return {
      text: item.employeeName,
      id: index,
      color: "#ea7a57",
      ResourceId: index,
      workDays: [0, 1, 2, 3, 4, 5, 6],
    }
  })

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
  const handleAction = async () => {
    setLoading(true);

    try {
      if (!employeeName.trim() || !jobRole.trim()) {
        // Check if either field is empty
        throw new Error("Please enter both service name and price.");
      }

      const collection = employeesCollection;

      if (selectedItemId) {
        // Editing existing item
        await databases.updateDocument(databaseID, collection, selectedItemId, {
          employeeName: employeeName,
          jobRole: jobRole,
        });
        setSelectedItemId("");
      } else {
        // Adding new item
        await databases.createDocument(databaseID, collection, uuidv4(), {
          employeeName: employeeName,
          jobRole: jobRole,
        });
      }

      reFetch("employees");
      setEmployeeName("");
      setJobRole("");
    } catch (error) {
      console.error("Error performing action:", error);
      alert(
        `Failed to ${selectedItemId ? "edit" : "add"} item. Please try again.`
      );
    } finally {
      setLoading(false);
    }
  };

  async function editEmployee(documentId: string) {
    try {
      const items = employees;
      const item = items.find((item: any) => item.$id === documentId);
      console.log(documentId, items, item);
      if (item) {
        setEmployeeName(item.employeeName);
        setJobRole(item.jobRole);
        setSelectedItemId(documentId);
      }
    } catch (error) {
      console.error("Error editing item:", error);
      alert("Failed to fetch item data. Please try again.");
    }
  }

  async function deleteEmployee(documentId: string) {
    try {
      await databases.deleteDocument(databaseID, employeesCollection, documentId);
      reFetch("employees");
    } catch (error) {
      console.error("Error deleting item:", error);
      alert("Failed to delete item. Please try again.");
    }
  }
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
              value={employeeName}
              onChange={(e) => setEmployeeName(e.target.value)}
            />
            <input
              className="priceInput"
              type="text"
              placeholder="Job Role"
              value={jobRole}
              onChange={(e) => setJobRole(e.target.value)}
            />
            <button onClick={handleAction} disabled={loading}>
              {loading
                ? selectedItemId
                  ? "Editing..."
                  : "Adding..."
                : selectedItemId
                ? "EDIT"
                : "ADD"}
            </button>
          </div>
        </div>

        <div className="rows">
          {employees.map((item: any, index: number) => (
            <div className="row" key={index}>
              <p className="title">
                {item.employeeName} - {item.jobRole}
              </p>
              <div className="options">
                <span onClick={() => editEmployee(item.$id)}>
                  <FaEdit />
                </span>
                <span onClick={() => deleteEmployee(item.$id)}>
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
