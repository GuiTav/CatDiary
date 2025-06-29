CREATE TABLE `catTable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`birthdate` text NOT NULL,
	`race` text NOT NULL,
	`sex` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `imageTable` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`catId` integer NOT NULL,
	`base64` text NOT NULL,
	FOREIGN KEY (`catId`) REFERENCES `catTable`(`id`) ON UPDATE no action ON DELETE cascade
);
