using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class ReadjustCarouselModel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "PublishedBy",
                table: "Carousels");

            migrationBuilder.AddColumn<string>(
                name: "CreatedBy",
                table: "Carousels",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "CreatedDate",
                table: "Carousels",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "CreatedBy",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "CreatedDate",
                table: "Carousels");

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "Carousels",
                type: "datetime2",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PublishedBy",
                table: "Carousels",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
