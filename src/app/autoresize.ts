import { Directive, HostListener, ElementRef } from "@angular/core";

@Directive({
	selector: "ion-textarea[autoresize]" // Attribute selector
})
export class Autoresize {

	@HostListener("input", ["$event.target"])
	onInput(textArea: HTMLTextAreaElement): void {
		this.adjust();
	}
    private maxHeight: number = 200;
	constructor(public element: ElementRef) {
	}


	


	ngOnInit(): void {
		this.adjust();
		 
	}
	adjust(): void {
        let ta = this.element.nativeElement.querySelector("textarea");
		if (ta == null) return;
		ta.style.overflow = "show";
		ta.style.height = null;
		ta.style.height = Math.min(ta.scrollHeight, this.maxHeight) + "px";
		//ta.style.height = "auto";
		//ta.style.height = ta.scrollHeight + "px";
		 
	}

}

