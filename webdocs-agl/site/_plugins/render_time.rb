# Check doc at http://jekyllrb.com/docs/plugins/#tags
# use in page with <p>{% render_time page rendered at: %}</p>

module Jekyll
  class RenderTimeTag < Liquid::Tag

    def initialize(tag_name, text, tokens)
      super
      @text = text
    end

    def render(context)
      "#{@text} #{Time.now}"
    end
  end
end

Liquid::Template.register_tag('render_time', Jekyll::RenderTimeTag)
