package es.cediant.db;
// Generated Jul 24, 2013 3:32:37 PM by Hibernate Tools 3.2.1.GA


import java.util.HashSet;
import java.util.Set;

/**
 * Role generated by hbm2java
 */
public class Role  implements java.io.Serializable {
    
     private static final long serialVersionUID = -1073516299568581649L;

     private Integer idRole;
     private String roleName;
     private Set usersRoles = new HashSet(0);

    public Role() {
    }

	
    public Role(String roleName) {
        this.roleName = roleName;
    }
    public Role(String roleName, Set usersRoles) {
       this.roleName = roleName;
       this.usersRoles = usersRoles;
    }
   
    public Integer getIdRole() {
        return this.idRole;
    }
    
    public void setIdRole(Integer idRole) {
        this.idRole = idRole;
    }
    public String getRoleName() {
        return this.roleName;
    }
    
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    public Set getUsersRoles() {
        return this.usersRoles;
    }
    
    public void setUsersRoles(Set usersRoles) {
        this.usersRoles = usersRoles;
    }




}


