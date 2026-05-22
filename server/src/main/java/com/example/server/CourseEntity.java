package com.example.server;

import jakarta.persistence.*;

@Entity
@Table(name = "courses")
public class CourseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String teacher;

    @Column(nullable = false)
    private int hours;

    public CourseEntity() {}

    public CourseEntity(String name, String teacher) {
        this.name = name;
        this.teacher = teacher;
        this.hours = 36; // 默认学时
    }

    public CourseEntity(String name, String teacher, int hours) {
        this.name = name;
        this.teacher = teacher;
        this.hours = hours;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getTeacher() { return teacher; }
    public void setTeacher(String teacher) { this.teacher = teacher; }
    public int getHours() { return hours; }
    public void setHours(int hours) { this.hours = hours; }
}