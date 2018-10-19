package letscode.restservice.domain;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonView;
import lombok.EqualsAndHashCode;
import lombok.ToString;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table
@ToString(of={"id","title","content"})
@EqualsAndHashCode(of={"id"})
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    //@JsonView(Views.IdName.class)
    private Long id;

    private String title;

    //@JsonView(Views.IdName.class)
    private String content;

    @Column(updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    @JsonView(Views.FullMessage.class)
    private LocalDateTime creationDate;

    @Column(updatable = false)
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "dd-MM-yyyy HH:mm:ss")
    private LocalDateTime deletedDate = null;

    private boolean deleted = false;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public LocalDateTime getCreationDate() {
        return creationDate;
    }

    public void setCreationDate(LocalDateTime creationDate) {
        this.creationDate = creationDate;
    }

    public LocalDateTime getDeletedDate() {
        return deletedDate;
    }

    public void setDeletedDate(LocalDateTime deletedDate) {
        this.deletedDate = deletedDate;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }
}
