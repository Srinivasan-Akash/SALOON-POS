import { useEffect } from "react"
import "./calender.scss"

import { Inject, ScheduleComponent, Day, Week, Month, Agenda, WorkWeek, ResourceDirective, ResourcesDirective, ViewDirective, ViewsDirective, DragAndDrop, Resize } from "@syncfusion/ej2-react-schedule"
export default function Calender() {

    useEffect(() => {
        const popup = document.querySelector('[style*="z-index: 999999999;"]');
        const popup2 = document.querySelector('[style*="z-index: 99999;"]');
        // 99999
        if (popup) {
            // Removing the element from the DOM
            popup.parentNode.removeChild(popup);
            console.log("Element with z-index 999999999 deleted.");
        }

        if (popup2) {
            // Removing the element from the DOM
            popup2.parentNode.removeChild(popup2);
            console.log("Element with z-index 999999999 deleted.");
        }


    }, [])

    const resourceData: Record<string, any>[] = [
        { text: 'Will Smith', id: 1, color: '#ea7a57', workDays: [1, 2, 4, 5], StartTime: '08:00', endHour: '15:00', ResourceId: 1 },
        { text: 'Alice', id: 2, color: 'rgb(53, 124, 210)', workDays: [1, 3, 5], startHour: '08:00', endHour: '17:00', ResourceId: 2 },
        { text: 'Robson', id: 3, color: '#7fa900', startHour: '08:00', endHour: '16:00', ResourceId: 3 }
    ];

    return (
        <div className={'calenderWindow'}>
            <ScheduleComponent>
                <ResourcesDirective>
                    <ResourceDirective field='DoctorId' title='Doctor Name' name='Doctors' dataSource={resourceData} textField='text' idField='id' groupIDField='groupId' colorField='color' workDaysField='workDays' startHourField='startHour' endHourField='endHour' />
                </ResourcesDirective>
                <ViewsDirective>
                    <ViewDirective option='WorkWeek' />
                    <ViewDirective option='Week' />
                    <ViewDirective option='Month' />
                </ViewsDirective>
                <Inject services={[WorkWeek, Week, Month, DragAndDrop, Resize]} />
            </ScheduleComponent>
        </div>
    )
}