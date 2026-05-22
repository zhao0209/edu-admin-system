# Edu Admin System - Система автоматизации административных и учебных процессов

Курсовой проект по дисциплине «Распределенные программные системы»

**Выполнил:** студент группы ПРИк-223 Чжан Цзиньчжао  
**Принял:** асс. каф. ИСПИ Евдокимов А.О.  
**Владимир, 2026 г.**

---

## Описание проекта

Система предназначена для управления расписанием занятий, кадровым учётом, документооборотом и формированием отчётности в образовательном учреждении.

Реализована в виде веб-приложения с архитектурой "клиент-сервер":
- **Frontend:** React 18
- **Backend:** Spring Boot 3.2 (Java 21)
- **База данных:** PostgreSQL 16

---

## Функциональные возможности

### Роли пользователей
- **Администратор** – управление курсами, персоналом, расписанием, документами, отчётами, заявлениями на отпуск.
- **Студент** – просмотр расписания, подача заявлений на отпуск, чтение утверждённых документов.

### Основные функции
- Регистрация и аутентификация
- CRUD для курсов, персонала, документов, отчётов, расписания
- Подача и обработка заявлений на отпуск
- Переключение языка (русский / китайский)

---

## Технологический стек

| Слой          | Технологии |
|---------------|------------|
| Фронтенд      | React 18, React Router, Context API, CSS |
| Бэкенд        | Java 21, Spring Boot 3.2.5, Spring Data JPA |
| База данных   | PostgreSQL 16 |
| Инструменты   | IntelliJ IDEA, VS Code, pgAdmin, Postman |
| Версионирование | Git, GitHub |

---

## База данных (основные таблицы)

- `users` – id, username, password, role  
- `courses` – id, name, teacher, hours  
- `students` – id, name, email, position, location  
- `documents` – id, title, content, status  
- `reports` – id, name, type, recipient, data, create_time  
- `schedules` – id, course, day, time, room, teacher  
- `leaves` – id, student, course, date, reason, status  

---

## Примеры кода

**Контроллер аутентификации (Java)**

    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        // проверка в БД ...
        response.put("success", true);
        response.put("role", user.getRole());
        return response;
    }

**Сущность JPA (CourseEntity)**

    @Entity
    @Table(name = "courses")
    public class CourseEntity {
        @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;
        private String name;
        private String teacher;
        private int hours;
        // getters/setters
    }

**React компонент переключения языка**

    const { t, toggleLanguage } = useLanguage();
    return <button onClick={toggleLanguage}>{t('lang_switch')}</button>;

---

## Запуск проекта

1. Установить PostgreSQL 16, создать БД edu_admin.
2. Открыть backend в IntelliJ IDEA, запустить ServerApplication.
3. Открыть frontend в VS Code, выполнить:
       npm install
       npm start
4. Перейти в браузере: http://localhost:3000
5. Тестовый администратор: admin / 123456

---

## Заключение

Разработана полнофункциональная система с ролевой моделью, CRUD-операциями и поддержкой двух языков. Готова к дальнейшему расширению.

---

## Скриншоты

(Добавьте скриншоты страницы входа, панели администратора, студенческой страницы, расписания, заявлений на отпуск)
