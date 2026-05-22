package com.example.server;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final CourseRepository courseRepo;
    private final StudentRepository studentRepo;
    private final DocumentRepository docRepo;
    private final ReportRepository reportRepo;
    private final ScheduleRepository scheduleRepo;

    public DataInitializer(CourseRepository courseRepo, StudentRepository studentRepo,
                           DocumentRepository docRepo, ReportRepository reportRepo,
                           ScheduleRepository scheduleRepo) {
        this.courseRepo = courseRepo;
        this.studentRepo = studentRepo;
        this.docRepo = docRepo;
        this.reportRepo = reportRepo;
        this.scheduleRepo = scheduleRepo;
    }

    @Override
    public void run(String... args) {
        if (courseRepo.count() == 0) {
            courseRepo.save(new CourseEntity("Распределенные программные системы", "Иванов И.И.", 36));
            courseRepo.save(new CourseEntity("Веб-дизайн", "Петров П.П.", 48));
            courseRepo.save(new CourseEntity("Тестирование ПО", "Сидоров С.С.", 24));
        }

        if (studentRepo.count() == 0) {
            studentRepo.save(new StudentEntity(
                    "Чжан Цзиньчжао",
                    "zhang@example.com",
                    "Профессор",
                    "Учебный корпус 301"
            ));
            studentRepo.save(new StudentEntity(
                    "Алексей Иванов",
                    "ivanov@example.com",
                    "Доцент",
                    "Административный корпус 201"
            ));
        }

        if (docRepo.count() == 0) {
            docRepo.save(new DocumentEntity("Приказ №1", "О зачислении студентов", "утверждён"));
            docRepo.save(new DocumentEntity("Распоряжение №2", "Об изменении расписания", "на согласовании"));
        }

        if (reportRepo.count() == 0) {
            reportRepo.save(new ReportEntity(
                    "Успеваемость за семестр",
                    "академическая",
                    "Учебный отдел",
                    "Средний балл студентов 85, что на 5% выше предыдущего семестра."
            ));
            reportRepo.save(new ReportEntity(
                    "Посещаемость за месяц",
                    "посещаемость",
                    "Деканат",
                    "Посещаемость в апреле 96%, на уровне марта."
            ));
        }

        if (scheduleRepo.count() == 0) {
            scheduleRepo.save(new ScheduleEntity("Распределенные программные системы", "понедельник", "18:00", "Аудитория 301", "Иванов И.И."));
            scheduleRepo.save(new ScheduleEntity("Веб-дизайн", "вторник", "18:00", "Компьютерный класс 105", "Петров П.П."));
            scheduleRepo.save(new ScheduleEntity("Тестирование ПО", "среда", "18:00", "Лаборатория 202", "Сидоров С.С."));
            scheduleRepo.save(new ScheduleEntity("Базы данных (доп.)", "четверг", "18:00", "Аудитория 410", "Кузнецов А.В."));
        }
    }
}