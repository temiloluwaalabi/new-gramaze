// /* eslint-disable @typescript-eslint/no-unused-vars */
// "use client";
// import {
//   ChevronLeft,
//   ChevronRight,
//   LayoutGrid,
//   List,
//   Search,
// } from "lucide-react";
// import moment from "moment";
// import React, { useState } from "react";
// import { Views, momentLocalizer, Calendar, View } from "react-big-calendar";

// import { Avatar, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";

// const localizer = momentLocalizer(moment);

// interface CalendarEvent {
//   id: string;
//   title: string;
//   start: Date;
//   end: Date;
//   attendees?: {
//     name: string;
//     avatar?: string;
//   }[];
// }

// export default function AppBigCalendar() {
//   const [events, setEvents] = useState<CalendarEvent[]>([
//     {
//       id: "1",
//       title: "Ekiye Perebuowei",
//       start: new Date(2025, 1, 6, 9, 0), // Feb 6, 9:00 AM
//       end: new Date(2025, 1, 6, 10, 0), // Feb 6, 10:00 AM
//       attendees: [
//         {
//           name: "Ekiye Perebuowei",
//           avatar:
//             "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png",
//         },
//       ],
//     },
//     {
//       id: "2",
//       title: "Halima Wakili",
//       start: new Date(2025, 1, 10, 9, 0),
//       end: new Date(2025, 1, 10, 10, 0),
//       attendees: [
//         {
//           name: "Halima Wakili",
//           avatar:
//             "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png",
//         },
//       ],
//     },
//     {
//       id: "3",
//       title: "Halima Ahmad",
//       start: new Date(2025, 1, 14, 9, 0),
//       end: new Date(2025, 1, 14, 10, 0),
//       attendees: [
//         {
//           name: "Halima Ahmad",
//           avatar:
//             "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png",
//         },
//       ],
//     },
//     {
//       id: "4",
//       title: "Halima Wakili",
//       start: new Date(2025, 1, 18, 9, 0),
//       end: new Date(2025, 1, 18, 10, 0),
//       attendees: [
//         {
//           name: "Halima Wakili",
//           avatar:
//             "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png",
//         },
//       ],
//     },
//     {
//       id: "5",
//       title: "Halima Wakili",
//       start: new Date(2025, 1, 20, 9, 0),
//       end: new Date(2025, 1, 20, 10, 0),
//       attendees: [
//         {
//           name: "Halima Wakili",
//           avatar:
//             "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png",
//         },
//       ],
//     },
//     {
//       id: "6",
//       title: "Halima Wakili",
//       start: new Date(2025, 1, 26, 9, 0),
//       end: new Date(2025, 1, 26, 10, 0),
//       attendees: [{ name: "Halima Wakili", avatar: "/avatars/halima.jpg" }],
//     },
//     {
//       id: "7",
//       title: "Halima Wakili",
//       start: new Date(2025, 1, 28, 9, 0),
//       end: new Date(2025, 1, 28, 10, 0),
//       attendees: [{ name: "Halima Wakili", avatar: "/avatars/halima.jpg" }],
//     },
//     {
//       id: "8",
//       title: "Meeting with Daniel James and others",
//       start: new Date(2025, 2, 4, 9, 0), // March 4, 9:00 AM
//       end: new Date(2025, 2, 4, 10, 0), // March 4, 10:00 AM
//       attendees: [
//         { name: "Daniel James", avatar: "/avatars/daniel.jpg" },
//         { name: "User 2", avatar: "/avatars/user2.jpg" },
//         { name: "User 3", avatar: "/avatars/user3.jpg" },
//       ],
//     },
//   ]);
//   const [currentDate, setCurrentDate] = useState(new Date(2025, 1));
//   const [view, setView] = useState<View>(Views.MONTH);

//   const EventComponent = ({ event }: { event: CalendarEvent }) => {
//     if (!event.attendees || event.attendees.length === 0) {
//       return <div className="p-1 text-xs">{event.title}</div>;
//     }

//     const hasMultipleAttendees = event.attendees.length > 1;
//     const mainAttendee = event.attendees[0];
//     const otherAttendeesCount = event.attendees.length - 1;

//     return (
//       <div className="flex items-center space-x-2 p-1">
//         <Avatar className="size-6">
//           <AvatarImage
//             src={
//               mainAttendee.avatar ||
//               "https://res.cloudinary.com/davidleo/image/upload/v1744904805/ac7e9cc006e377a554341d67f0d9b385_xbh4qh.png"
//             }
//             alt={mainAttendee.name}
//           />
//         </Avatar>
//         <div className="flex flex-col">
//           <span className="text-xs font-medium">{mainAttendee.name}</span>
//           <span className="text-xs text-gray-500">
//             {moment(event.start).format("h:mm A")} -{" "}
//             {moment(event.end).format("h:mm A")}
//           </span>
//           {hasMultipleAttendees && (
//             <span className="text-xs text-gray-500">
//               +{otherAttendeesCount} others
//             </span>
//           )}
//         </div>
//       </div>
//     );
//   };

//   const navigatePrev = () => {
//     const newDate = new Date(currentDate);
//     if (view === Views.MONTH) {
//       newDate.setMonth(newDate.getMonth() - 1);
//     } else if (view === Views.WEEK) {
//       newDate.setDate(newDate.getDate() - 7);
//     }
//     setCurrentDate(newDate);
//   };

//   const navigateNext = () => {
//     const newDate = new Date(currentDate);
//     if (view === Views.MONTH) {
//       newDate.setMonth(newDate.getMonth() + 1);
//     } else if (view === Views.WEEK) {
//       newDate.setDate(newDate.getDate() + 7);
//     }
//     setCurrentDate(newDate);
//   };

//   const currentMonthName = moment(currentDate).format("MMM");
//   return (
//     <Card className="w-full border shadow-sm">
//       <div className="p-4">
//         <div className="mb-4 flex items-center justify-between">
//           <div className="flex items-center space-x-4">
//             <Button variant={"outline"} size={"icon"} onClick={navigatePrev}>
//               <ChevronLeft className="size-4" />
//             </Button>
//             <h2 className="text-lg font-medium">{currentMonthName}</h2>
//             <Button variant="outline" size="icon" onClick={navigateNext}>
//               <ChevronRight className="h-4 w-4" />
//             </Button>
//           </div>

//           <div className="flex items-center space-x-2">
//             <div className="relative">
//               <Search className="absolute top-1/2 left-2 size-4 -translate-y-1/2 transform text-gray-400" />
//               <Input
//                 type="text"
//                 placeholder="Search"
//                 className="border-input h-9 rounded-md border bg-transparent px-3 py-1 pl-8 text-sm shadow-sm transition-colors"
//               />
//             </div>

//             <div className="flex rounded-md border">
//               <Button
//                 variant={"ghost"}
//                 size={"icon"}
//                 className="rounded-l-none border-1"
//                 onClick={() =>
//                   setView(view === Views.MONTH ? Views.AGENDA : Views.MONTH)
//                 }
//               >
//                 {view === Views.MONTH ? (
//                   <List className="h-4 w-4" />
//                 ) : (
//                   <LayoutGrid className="h-4 w-4" />
//                 )}
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//       {/* Calendar */}
//       <div className="h-screen max-h-[800px]">
//         <Calendar
//           localizer={localizer}
//           events={events}
//           startAccessor={"start"}
//           endAccessor={"end"}
//           date={currentDate}
//           onNavigate={(date) => setCurrentDate(date)}
//           view={view}
//           onView={setView}
//           components={{
//             event: EventComponent,
//           }}
//           dayPropGetter={(date) => {
//             const isToday = moment(date).isSame(new Date(), "day");

//             return {
//               className: isToday ? "bg-blue-500" : "",
//               style: {
//                 margin: 0,
//                 padding: 0,
//               },
//             };
//           }}
//           eventPropGetter={(event) => ({
//             className: "bg-blue-500 border-none text-black rounded-md",
//           })}
//         />
//       </div>
//     </Card>
//   );
// }
