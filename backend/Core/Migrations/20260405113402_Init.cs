using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace Core.Migrations
{
    /// <inheritdoc />
    public partial class Init : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "body_parts",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_body_parts", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "equipment",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_equipment", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "muscles",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    body_part_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_muscles", x => x.id);
                    table.ForeignKey(
                        name: "fk_muscles_body_parts_body_part_id",
                        column: x => x.body_part_id,
                        principalTable: "body_parts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "exercises",
                columns: table => new
                {
                    id = table.Column<string>(type: "character varying(36)", maxLength: 36, nullable: false),
                    equipment_id = table.Column<int>(type: "integer", nullable: false),
                    body_part_id = table.Column<int>(type: "integer", nullable: false),
                    target_muscle_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "character varying(255)", maxLength: 255, nullable: false),
                    instructions = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: false),
                    difficulty = table.Column<byte>(type: "smallint", nullable: false),
                    category = table.Column<byte>(type: "smallint", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_exercises", x => x.id);
                    table.ForeignKey(
                        name: "fk_exercises_body_parts_body_part_id",
                        column: x => x.body_part_id,
                        principalTable: "body_parts",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_exercises_equipment_equipment_id",
                        column: x => x.equipment_id,
                        principalTable: "equipment",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(
                        name: "fk_exercises_muscles_target_muscle_id",
                        column: x => x.target_muscle_id,
                        principalTable: "muscles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "exercise_secondary_muscle",
                columns: table => new
                {
                    exercise_id = table.Column<string>(type: "character varying(36)", nullable: false),
                    secondary_muscle_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("pk_exercise_secondary_muscle", x => new { x.exercise_id, x.secondary_muscle_id });
                    table.ForeignKey(
                        name: "fk_exercise_secondary_muscle_exercises_exercise_id",
                        column: x => x.exercise_id,
                        principalTable: "exercises",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "fk_exercise_secondary_muscle_muscles_secondary_muscle_id",
                        column: x => x.secondary_muscle_id,
                        principalTable: "muscles",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "ix_exercise_secondary_muscle_secondary_muscle_id",
                table: "exercise_secondary_muscle",
                column: "secondary_muscle_id");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_body_part_id",
                table: "exercises",
                column: "body_part_id");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_equipment_id",
                table: "exercises",
                column: "equipment_id");

            migrationBuilder.CreateIndex(
                name: "ix_exercises_target_muscle_id",
                table: "exercises",
                column: "target_muscle_id");

            migrationBuilder.CreateIndex(
                name: "ix_muscles_body_part_id",
                table: "muscles",
                column: "body_part_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "exercise_secondary_muscle");

            migrationBuilder.DropTable(
                name: "exercises");

            migrationBuilder.DropTable(
                name: "equipment");

            migrationBuilder.DropTable(
                name: "muscles");

            migrationBuilder.DropTable(
                name: "body_parts");
        }
    }
}
