package com.ravex.backend.tools;

import net.sourceforge.plantuml.SourceStringReader;
import org.reflections.Reflections;

import jakarta.persistence.*;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.lang.reflect.Field;
import java.lang.reflect.ParameterizedType;
import java.lang.reflect.Type;
import java.util.*;

public class UmlGenerator {

    private static class Relation {
        String from;
        String to;
        String type;
        String fromCardinality;
        String toCardinality;
        String label;
        
        public Relation(String from, String to, String type, String fromCardinality, String toCardinality, String label) {
            this.from = from;
            this.to = to;
            this.type = type;
            this.fromCardinality = fromCardinality;
            this.toCardinality = toCardinality;
            this.label = label;
        }
        
        @Override
        public boolean equals(Object obj) {
            if (this == obj) return true;
            if (obj == null || getClass() != obj.getClass()) return false;
            Relation relation = (Relation) obj;
            return Objects.equals(from, relation.from) && Objects.equals(to, relation.to) ||
                   Objects.equals(from, relation.to) && Objects.equals(to, relation.from);
        }
        
        @Override
        public int hashCode() {
            return Objects.hash(Math.min(from.hashCode(), to.hashCode()), 
                              Math.max(from.hashCode(), to.hashCode()));
        }
    }

    public static void main(String[] args) throws Exception {
        // 📦 Package où se trouvent tes entités
        Reflections reflections = new Reflections("com.ravex.backend.domain.model");

        // Récupère toutes les classes annotées avec @Entity
        Set<Class<?>> entities = reflections.getTypesAnnotatedWith(Entity.class);

        StringBuilder puml = new StringBuilder();
        puml.append("@startuml\n");

        // Configuration pour un style plus professionnel
        puml.append("!theme plain\n");
        puml.append("skinparam classAttributeIconSize 0\n");
        puml.append("skinparam classFontSize 12\n");
        puml.append("skinparam classAttributeFontSize 10\n");
        puml.append("skinparam backgroundColor #FEFEFE\n");
        puml.append("skinparam class {\n");
        puml.append("  BackgroundColor #E8F4F8\n");
        puml.append("  BorderColor #2E86AB\n");
        puml.append("  ArrowColor #2E86AB\n");
        puml.append("}\n");
        puml.append("skinparam stereotypeCBackgroundColor #A23B72\n");
        puml.append("left to right direction\n\n");

        // 1️⃣ Déclaration des classes avec leurs attributs détaillés
        for (Class<?> entity : entities) {
            puml.append("class ").append(entity.getSimpleName());

            // Ajout du stéréotype @Entity
            puml.append(" <<Entity>> {\n");

            // Séparation des champs par catégories
            List<Field> ids = new ArrayList<>();
            List<Field> foreignKeys = new ArrayList<>();
            List<Field> basicFields = new ArrayList<>();
            List<Field> relationFields = new ArrayList<>();
            
            for (Field field : entity.getDeclaredFields()) {
                if (field.isAnnotationPresent(Id.class)) {
                    ids.add(field);
                } else if (isForeignKeyField(field)) {
                    foreignKeys.add(field);
                } else if (isRelationField(field)) {
                    relationFields.add(field);
                } else if (!isInternalField(field)) {
                    basicFields.add(field);
                }
            }

            // Affichage des IDs en premier
            for (Field field : ids) {
                puml.append("  {field} +").append(formatField(field)).append(" <<PK>>\n");
            }

            // Affichage des Foreign Keys après les PKs
            for (Field field : foreignKeys) {
                puml.append("  {field} ").append(formatField(field)).append(" <<FK>>\n");
            }
            
            if (!ids.isEmpty() && (!foreignKeys.isEmpty() || !basicFields.isEmpty() || !relationFields.isEmpty())) {
                puml.append("  --\n");
            }

            // Séparateur après les Foreign Keys si nécessaire
            if (!foreignKeys.isEmpty() && (!basicFields.isEmpty() || !relationFields.isEmpty())) {
                puml.append("  --\n");
            }

            // Affichage des champs basiques
            for (Field field : basicFields) {
                puml.append("  ").append(formatField(field)).append("\n");
            }

            // Séparateur avant les relations si nécessaire
            if (!basicFields.isEmpty() && !relationFields.isEmpty()) {
                puml.append("  --\n");
            }

            // Affichage des champs de relation (optionnel, pour info)
            for (Field field : relationFields) {
                puml.append("  {field} ").append(formatRelationField(field)).append("\n");
            }

            puml.append("}\n\n");
        }

        // 2️⃣ Gestion intelligente des relations (évite les doublons)
        Map<String, Relation> relations = new HashMap<>();
        
        for (Class<?> entity : entities) {
            for (Field field : entity.getDeclaredFields()) {
                processRelationField(entity, field, relations);
            }
        }

        // 3️⃣ Génération des relations uniques
        for (Relation relation : relations.values()) {
            puml.append(formatRelation(relation)).append("\n");
        }

        puml.append("\n@enduml");

        // 🔥 Sauvegarde en PNG
        try (OutputStream png = new FileOutputStream("target/diagram.png")) {
            SourceStringReader reader = new SourceStringReader(puml.toString());
            reader.outputImage(png).getDescription();
        }

        // 🔥 Sauvegarde aussi le .puml
        try (FileOutputStream fos = new FileOutputStream("target/diagram.puml")) {
            fos.write(puml.toString().getBytes());
        }

        System.out.println("✅ Diagramme généré : target/diagram.png et target/diagram.puml");
        System.out.println("📄 Contenu PlantUML :\n" + puml.toString());
    }

    private static String formatField(Field field) {
        String visibility = getVisibility(field);
        String name = field.getName();
        String type = getSimpleTypeName(field.getType());
        
        // Ajout d'annotations importantes
        StringBuilder annotations = new StringBuilder();
        if (field.isAnnotationPresent(Column.class)) {
            Column col = field.getAnnotation(Column.class);
            if (!col.nullable()) {
                annotations.append(" {not null}");
            }
            if (col.unique()) {
                annotations.append(" {unique}");
            }
        }
        
        return visibility + name + " : " + type + annotations.toString();
    }
    
    private static String formatRelationField(Field field) {
        String name = field.getName();
        String type = getRelationType(field);
        return name + " : " + type;
    }
    
    private static String getVisibility(Field field) {
        // Simplification : la plupart des champs JPA sont private
        return "- ";
    }
    
    private static String getSimpleTypeName(Class<?> type) {
        if (type.getPackage() != null && type.getPackage().getName().startsWith("java.")) {
            return type.getSimpleName();
        }
        return type.getSimpleName();
    }
    
    private static String getRelationType(Field field) {
        if (field.isAnnotationPresent(OneToMany.class) || field.isAnnotationPresent(ManyToMany.class)) {
            return "List<" + getGenericTypeName(field) + ">";
        } else {
            return field.getType().getSimpleName();
        }
    }

    private static void processRelationField(Class<?> entity, Field field, Map<String, Relation> relations) {
        String fromEntity = entity.getSimpleName();
        
        if (field.isAnnotationPresent(OneToMany.class)) {
            String toEntity = getGenericTypeName(field);
            String key = createRelationKey(fromEntity, toEntity);
            
            if (!relations.containsKey(key)) {
                relations.put(key, new Relation(fromEntity, toEntity, "-->", "1", "0..*", field.getName()));
            }
            
        } else if (field.isAnnotationPresent(ManyToOne.class)) {
            String toEntity = field.getType().getSimpleName();
            String key = createRelationKey(toEntity, fromEntity);
            
            if (!relations.containsKey(key)) {
                relations.put(key, new Relation(toEntity, fromEntity, "-->", "1", "0..*", ""));
            }
            
        } else if (field.isAnnotationPresent(OneToOne.class)) {
            String toEntity = field.getType().getSimpleName();
            String key = createRelationKey(fromEntity, toEntity);
            
            if (!relations.containsKey(key)) {
                relations.put(key, new Relation(fromEntity, toEntity, "--", "0..1", "0..1", field.getName()));
            }
            
        } else if (field.isAnnotationPresent(ManyToMany.class)) {
            String toEntity = getGenericTypeName(field);
            String key = createRelationKey(fromEntity, toEntity);
            
            if (!relations.containsKey(key)) {
                relations.put(key, new Relation(fromEntity, toEntity, "<-->", "*", "*", field.getName()));
            }
        }
    }
    
    private static String createRelationKey(String entity1, String entity2) {
        // Créé une clé unique pour éviter les relations dupliquées
        return entity1.compareTo(entity2) < 0 ? entity1 + "-" + entity2 : entity2 + "-" + entity1;
    }
    
    private static String formatRelation(Relation relation) {
        StringBuilder sb = new StringBuilder();
        sb.append(relation.from);
        
        // Cardinalité de départ
        if (!relation.fromCardinality.isEmpty()) {
            sb.append(" \"").append(relation.fromCardinality).append("\"");
        }
        
        // Type de relation
        sb.append(" ").append(relation.type).append(" ");
        
        // Cardinalité d'arrivée
        if (!relation.toCardinality.isEmpty()) {
            sb.append("\"").append(relation.toCardinality).append("\" ");
        }
        
        sb.append(relation.to);
        
        // Label de la relation
        if (!relation.label.isEmpty()) {
            sb.append(" : ").append(relation.label);
        }
        
        return sb.toString();
    }

    private static boolean isForeignKeyField(Field field) {
        // Détection des Foreign Keys par plusieurs moyens
        return field.isAnnotationPresent(JoinColumn.class) ||
               field.isAnnotationPresent(ManyToOne.class) ||
               (field.isAnnotationPresent(OneToOne.class) && !isOwnerSide(field)) ||
               (field.getName().toLowerCase().endsWith("id") && 
                !field.isAnnotationPresent(Id.class) && 
                (field.getType().equals(Long.class) || field.getType().equals(Integer.class) || 
                 field.getType().equals(long.class) || field.getType().equals(int.class) || 
                 field.getType().equals(String.class)));
    }
    
    private static boolean isOwnerSide(Field field) {
        // Dans une relation OneToOne, le côté propriétaire a généralement @JoinColumn
        // Le côté inverse a mappedBy
        if (field.isAnnotationPresent(OneToOne.class)) {
            OneToOne oneToOne = field.getAnnotation(OneToOne.class);
            return oneToOne.mappedBy().isEmpty(); // Si mappedBy est vide, c'est le côté propriétaire
        }
        return true;
    }

    private static boolean isRelationField(Field field) {
        return field.isAnnotationPresent(OneToMany.class) ||
               field.isAnnotationPresent(ManyToMany.class) ||
               (field.isAnnotationPresent(OneToOne.class) && isOwnerSide(field)) ||
               (field.isAnnotationPresent(ManyToOne.class) && !isForeignKeyField(field));
    }
    
    private static boolean isInternalField(Field field) {
        String fieldName = field.getName();
        return fieldName.startsWith("$") || 
               fieldName.equals("serialVersionUID") ||
               field.isSynthetic();
    }

    // Helper amélioré pour récupérer le type générique
    private static String getGenericTypeName(Field field) {
        try {
            Type genericType = field.getGenericType();
            if (genericType instanceof ParameterizedType) {
                ParameterizedType paramType = (ParameterizedType) genericType;
                Type[] typeArgs = paramType.getActualTypeArguments();
                if (typeArgs.length > 0) {
                    String typeName = typeArgs[0].getTypeName();
                    // Enlève le package complet pour garder seulement le nom de la classe
                    return typeName.substring(typeName.lastIndexOf('.') + 1);
                }
            }
        } catch (Exception e) {
            System.err.println("Erreur lors de la récupération du type générique pour " + field.getName() + ": " + e.getMessage());
        }
        return field.getType().getSimpleName();
    }
}