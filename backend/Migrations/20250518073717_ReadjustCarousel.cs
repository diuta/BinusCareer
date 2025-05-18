using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace backend.Migrations
{
    public partial class ReadjustCarousel : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "CategoryId",
                table: "Carousels",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "ExpiredDate",
                table: "Carousels",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "PostedDate",
                table: "Carousels",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<DateTime>(
                name: "PublishedAt",
                table: "Carousels",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<string>(
                name: "PublishedBy",
                table: "Carousels",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "UpdatedAt",
                table: "Carousels",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdatedBy",
                table: "Carousels",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Carousels_CategoryId",
                table: "Carousels",
                column: "CategoryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Carousels_Categories_CategoryId",
                table: "Carousels",
                column: "CategoryId",
                principalTable: "Categories",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Carousels_Categories_CategoryId",
                table: "Carousels");

            migrationBuilder.DropIndex(
                name: "IX_Carousels_CategoryId",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "CategoryId",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "ExpiredDate",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "PostedDate",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "PublishedAt",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "PublishedBy",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "UpdatedAt",
                table: "Carousels");

            migrationBuilder.DropColumn(
                name: "UpdatedBy",
                table: "Carousels");
        }
    }
}
