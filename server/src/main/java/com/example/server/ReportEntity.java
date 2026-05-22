package com.example.server;

import jakarta.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reports")
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    private String type;       // академическая, посещаемость, ресурс

    private String recipient;  // 呈报对象

    @Column(columnDefinition = "TEXT")
    private String data;

    @Temporal(TemporalType.TIMESTAMP)
    private Date createTime;

    public ReportEntity() {}

    public ReportEntity(String name, String type, String data) {
        this.name = name;
        this.type = type;
        this.data = data;
        this.createTime = new Date();
    }

    public ReportEntity(String name, String type, String recipient, String data) {
        this.name = name;
        this.type = type;
        this.recipient = recipient;
        this.data = data;
        this.createTime = new Date();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getRecipient() { return recipient; }
    public void setRecipient(String recipient) { this.recipient = recipient; }
    public String getData() { return data; }
    public void setData(String data) { this.data = data; }
    public Date getCreateTime() { return createTime; }
    public void setCreateTime(Date createTime) { this.createTime = createTime; }
}