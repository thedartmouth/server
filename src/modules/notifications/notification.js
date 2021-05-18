export class Notification {
	id
	type
	title
	body
	targetTime // when this notification should trigger on client devices
	createdTime // when this notification was created
	triggered
	tagSlug
	articleSlug

	constructor(id, type, { title, body, tagSlug, articleSlug }, targetTime) {
		this.id = id
		this.type = type
		switch (type) {
			case 'ARTICLE':
				this.tagSlug = tagSlug
				this.articleSlug = articleSlug
				this.title = title
				this.body = body
				break
			case 'GENERAL':
				this.title = title
				this.body = body
				break
			default:
				throw new Error(`Invalid notification type, received ${type}.`)
		}
		this.targetTime = targetTime
		this.createdTime = new Date()
		this.triggered = false
	}
}
