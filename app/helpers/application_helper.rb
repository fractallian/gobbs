module ApplicationHelper

  GAME_TREE = YAML.load_file(File.join(File.dirname(__FILE__), "game_selection.yml"))

  def jqm(role, data = {}, html_opts = {}, &block)
    content_tag('div', html_opts.merge({:data => {:role => role}.merge(data)}), &block)
  end

  def game_selection_tree
    link_tree(GAME_TREE)
  end

  def link_tree(tree)
    tree.map do |page|
      jqm(:page, {}, :id => page['id']) do
        jqm(:content) do
          jqm(:listview, :inset => true) do
            page['items'].map do |item|
              text = item.delete('text')
              item['href'] = "#" + item['href'] if item['href']
              content_tag(:li, content_tag(:a, text, item))
            end.join.html_safe
          end
        end
      end
    end.join.html_safe
  end
end
