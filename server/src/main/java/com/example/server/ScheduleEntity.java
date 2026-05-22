package com.example.server;

import jakarta.persistence.*;

@Entity
@Table(name = "schedules")
public class ScheduleEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String course;

    private String day;   // суббота, воскресенье
    private String time;  // 09:00 - 12:00
    private String room;
    private String teacher;

    public ScheduleEntity() {}

    public ScheduleEntity(String course, String day, String time, String room, String teacher) {
        this.course = course;
        this.day = day;
        this.time = time;
        this.room = room;
        this.teacher = teacher;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCourse() { return course; }
    public void setCourse(String course) { this.course = course; }
    public String getDay() { return day; }
    public void setDay(String day) { this.day = day; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }
    public String getRoom() { return room; }
    public void setRoom(String room) { this.room = room; }
    public String getTeacher() { return teacher; }
    public void setTeacher(String teacher) { this.teacher = teacher; }
}